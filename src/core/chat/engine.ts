import {
  AnyVariables,
  Client,
  OperationResult,
  TypedDocumentNode,
  fetchExchange,
  subscriptionExchange,
  createClient,
} from "@urql/core"
import { Engine as IEngine, EngineInitConfig } from "../../interfaces/chat/core"
import HTTPClient from "../httpClient"
import { QIError } from "./qierror"
import Maybe from "../../types/general/maybe"
import { RealTimeWebSocketConnectionParams } from "../../types/chat/realtimewebsocketconnectionparams"
import { FetchBody } from "@urql/core/dist/urql-core-chunk"
import UUIDSubscriptionClient from "./uuidsubscriptionclient"
import { Observable } from "subscriptions-transport-ws"
import { v4 as uuid4 } from "uuid"
import { SubscriptionGarbage } from "../../types/chat/subscriptiongarbage"
import forge = require("node-forge")
import { KeyPairItem } from "../../types/chat/keypairitem"

/**
 * Represents an Engine class that extends HTTPClient and implements IEngine interface.
 * Manages API configurations, WebSocket connections, and GraphQL operations.
 * @extends HTTPClient
 * @implements IEngine
 */

export class Engine extends HTTPClient implements IEngine {
  protected _jwtToken: Maybe<string> = null
  protected _apiKey: Maybe<string> = null
  protected _apiUrl: Maybe<URL> = null
  protected _realtimeApiUrl: Maybe<URL> = null
  protected _realtimeAuthorizationToken: Maybe<string> = null
  protected _parentConfig: Maybe<EngineInitConfig> = null
  protected _client: Maybe<Client> = null
  protected _realtimeClient: Maybe<UUIDSubscriptionClient> = null
  protected _userKeyPair: Maybe<forge.pki.rsa.KeyPair> = null
  protected _mapKeyPairs: Maybe<Array<KeyPairItem>> = null

  private _connectCallback: Maybe<Function> = null
  private _connectionParams: Maybe<RealTimeWebSocketConnectionParams> = null
  private _offEventsFnsCollector: Maybe<Array<Function>> = null
  private _unsubscribeGarbageCollector: Maybe<Array<SubscriptionGarbage>> = null

  static readonly WS_TIMEOUT = 300000 //five minutes

  constructor(config: EngineInitConfig) {
    super()

    this._jwtToken = config.jwtToken
    this._apiKey = config.apiKey
    this._apiUrl = new URL(config.apiUrl)
    this._realtimeApiUrl = new URL(config.realtimeApiUrl)
    this._realtimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`
    this._parentConfig = config
    this._mapKeyPairs = []
    this._connectionParams = {
      Authorization: null,
      host: null,
    }
    this._offEventsFnsCollector = []
    this._unsubscribeGarbageCollector = []
  }

  private _returnQIErrorInternalClientNotDefined(): QIError {
    return new QIError(
      {
        networkError: undefined,
        graphQLErrors: undefined,
        response: undefined,
      },
      "QIError: internal _client is not defined.",
      false
    )
  }

  private _returnQIErrorNoDataAvailable(): QIError {
    return new QIError(
      {
        networkError: undefined,
        graphQLErrors: undefined,
        response: undefined,
      },
      "QIError: no data in the response is available.",
      false
    )
  }

  private _removeDuplicatedFromGarbageCollector(
    objects: SubscriptionGarbage[]
  ): SubscriptionGarbage[] {
    const seen = new Map<string, SubscriptionGarbage>()

    for (const object of objects) {
      if (!seen.has(object.uuid)) {
        seen.set(object.uuid, object)
      }
    }

    return Array.from(seen.values())
  }

  private _handleWSClient(): void {
    if (!this._realtimeClient) return
    if (!this._offEventsFnsCollector) return

    const offConnecting = this._realtimeClient.on("connecting", () => {
      console.log("connecting...")
    })

    const offReconnecting = this._realtimeClient.on("reconnecting", () => {
      console.log("reconnecting...")
    })

    const offDisconnected = this._realtimeClient.on("disconnected", () => {
      console.log("disconnected")
    })

    const offReconnected = this._realtimeClient.on("reconnected", (payload) => {
      console.log("reconnected", "[payload]:", payload)
      //reset?
      if (this._connectCallback) this._connectCallback()
    })

    const offError = this._realtimeClient.on("error", () => {
      console.log("websocket error")
    })

    const offConnected = this._realtimeClient.on(
      "connected",
      (payload: { connectionTimeoutMs: number }) => {
        console.log("connected", "[payload]:", payload)

        if (this._connectCallback) this._connectCallback()
      }
    )

    this._offEventsFnsCollector = [
      offConnecting,
      offReconnecting,
      offDisconnected,
      offReconnected,
      offError,
      offConnected,
    ]
  }

  private _makeWSClient(callback: Function): void {
    try {
      this._connectionParams!.Authorization = this._realtimeAuthorizationToken
      this._connectionParams!.host = this._apiUrl!.toString()
        .replace("https://", "")
        .replace("/graphql", "")

      this._realtimeClient = new UUIDSubscriptionClient(
        this._realtimeApiUrl!.toString(),
        {
          reconnect: true,
          timeout: Engine.WS_TIMEOUT,
        },
        this._connectionParams!
      )

      this._connectCallback = callback
      this._handleWSClient()
    } catch (error) {
      console.log(error)
      throw new Error(
        "Exception during the creation of the websocket client. See the console for more info."
      )
    }
  }

  private _computeOperation(
    operation: FetchBody & { data?: string }
  ): Observable<any> {
    if (this._connectionParams)
      operation.extensions = {
        authorization: {
          Authorization: this._connectionParams.Authorization,
          host: this._connectionParams.host,
        },
      }
    const query = {
      query: operation.query!,
      variables: operation.variables,
    }
    operation.data = JSON.stringify(query)

    delete operation.operationName
    delete operation.variables

    return this._realtimeClient!.request(operation)
  }

  private _makeClient(): Client | null {
    if (!this._jwtToken) return null
    if (!this._apiKey) return null
    if (!this._apiUrl) return null
    if (!this._realtimeClient) return null
    if (!this._client) {
      try {
        this._client = createClient({
          url: this._apiUrl.toString(),
          exchanges: [
            fetchExchange,
            subscriptionExchange({
              forwardSubscription: (op: FetchBody & { data?: string }) => {
                return this._computeOperation(op)
              },
            }),
          ],
          fetchOptions: () => {
            return {
              headers: {
                Authorization: `${this._apiKey}`,
              },
            }
          },
        })
      } catch (error) {
        console.error(error)
        return null
      }
    }

    return this._client
  }

  private _reset(callback: Function) {
    if (this._realtimeClient) {
      this._unsubscribeGarbage() //clear all the subscription generated with _subscription()
      this._realtimeClient.unsubscribeAll() //clear all the subscriptions of UUIDSubscriptionClient
      this._offUUIDSubscriptionEvents() //clear all the events of UUIDSubscriptionClient
      this._realtimeClient.close() //close the websocket connection

      this._unsubscribeGarbageCollector = [] //reset the unsubscribe garbage collector array
      this._offEventsFnsCollector = [] //reset the UUIDSubscriptionClient off events collector array
      callback()
    }
  }

  private _offUUIDSubscriptionEvents(): void {
    if (this._offEventsFnsCollector) {
      this._offEventsFnsCollector.forEach((fn) => {
        try {
          fn()
        } catch (error) {
          console.warn(
            "[warning]: an exception occured while the client was clearing the subscription off events. More info -> ",
            error
          )
        }
      })
    }
  }

  private _unsubscribeGarbage(): void {
    if (this._unsubscribeGarbageCollector) {
      this._unsubscribeGarbageCollector.forEach(
        (garbage: SubscriptionGarbage) => {
          try {
            garbage.unsubscribe()
          } catch (error) {
            console.warn(
              `[warning]: an exception occured while the client was clearing the subscription [${garbage.uuid}] garbage. More info -> `,
              error
            )
          }
        }
      )
    }
  }

  protected _handleResponse<K extends string, T extends { [key in K]: any }, R>(
    queryName: K,
    response: OperationResult<T>
  ): R | QIError {
    console.log(response)
    console.log(response.error?.networkError)
    if (response.error && (!("data" in response) || !response.data))
      return new QIError(response.error, "", true)

    if (
      !("data" in response) ||
      typeof response.data === "undefined" ||
      response.data === null
    )
      return this._returnQIErrorNoDataAvailable()

    return response.data[queryName] as R
  }

  protected _subscription<
    TArgs,
    TSubscriptionResult extends { [x: string]: any }
  >(
    node: TypedDocumentNode<any, AnyVariables>,
    __functionName: string,
    args: TArgs
  ):
    | {
        subscribe: (
          onResult: (
            value: OperationResult<
              TSubscriptionResult,
              TArgs & {
                jwt: string
              }
            >
          ) => void
        ) => { unsubscribe: () => void }
        uuid: string
      }
    | QIError {
    try {
      const client = this._makeClient()

      if (!client) return this._returnQIErrorInternalClientNotDefined()

      const subscription = client.subscription<
        TSubscriptionResult,
        TArgs & { jwt: string }
      >(node, { ...args, jwt: `${this._jwtToken}` })

      return {
        subscribe: subscription.subscribe,
        uuid: uuid4(),
      }
    } catch (error) {
      console.error(error)
      console.error("arguments:", args)
      throw new Error(
        `Internal error: ${__functionName} thrown an exception. See the console to have more information.`
      )
    }
  }

  protected async _mutation<
    TArgs,
    TMutationResult extends { [x: string]: any },
    TResult
  >(
    key: string,
    node: TypedDocumentNode<any, AnyVariables>,
    __functionName: string,
    args: TArgs
  ): Promise<TResult | QIError> {
    try {
      const client = this._makeClient()

      if (!client) return this._returnQIErrorInternalClientNotDefined()

      const response = await client
        .mutation<TMutationResult, TArgs & { jwt: string }>(node, {
          ...args,
          jwt: `${this._jwtToken}`,
        })
        .toPromise()

      return this._handleResponse<typeof key, TMutationResult, TResult>(
        key,
        response
      )
    } catch (error) {
      console.error(error)
      console.error("arguments:", args)
      throw new Error(
        `Internal error: ${__functionName} thrown an exception. See the console to have more information.`
      )
    }
  }

  protected async _query<
    TArgs,
    TQueryResult extends { [x: string]: any },
    TResult
  >(
    key: string,
    node: TypedDocumentNode<any, AnyVariables>,
    __functionName: string,
    args: TArgs
  ): Promise<TResult | QIError> {
    try {
      const client = this._makeClient()

      if (!client) return this._returnQIErrorInternalClientNotDefined()

      const response = await client
        .query<TQueryResult, TArgs & { jwt: string }>(node, {
          ...args,
          jwt: `${this._jwtToken}`,
        })
        .toPromise()

      return this._handleResponse<typeof key, TQueryResult, TResult>(
        key,
        response
      )
    } catch (error) {
      console.error(error)
      console.error("arguments:", args)
      throw new Error(
        `Internal error: ${__functionName}() thrown an exception. See the console to have more information.`
      )
    }
  }

  refreshJWTToken(jwt: string): void {
    this._jwtToken = jwt
    this._realtimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`
  }

  reconnect(callback: Function): void {
    this._reset(() => {
      this.connect(callback)
    })
  }

  connect(callback: Function): void {
    this._makeWSClient(callback)
  }

  collect(garbage: SubscriptionGarbage | SubscriptionGarbage[]): void {
    if (!this._unsubscribeGarbageCollector) {
      if (garbage instanceof Array) this._unsubscribeGarbageCollector = garbage
      else this._unsubscribeGarbageCollector = [garbage]
    } else {
      if (garbage instanceof Array) {
        garbage.forEach((g: SubscriptionGarbage) => {
          if (
            this._unsubscribeGarbageCollector?.findIndex(
              (el: SubscriptionGarbage) => {
                return el.uuid.toLowerCase() === g.uuid.toLowerCase()
              }
            ) === -1
          )
            this._unsubscribeGarbageCollector.push(g)
        })
      } else {
        if (
          this._unsubscribeGarbageCollector?.findIndex(
            (el: SubscriptionGarbage) => {
              return el.uuid.toLowerCase() === garbage.uuid.toLowerCase()
            }
          ) === -1
        )
          this._unsubscribeGarbageCollector.push(garbage)
      }
    }

    this._removeDuplicatedFromGarbageCollector(
      this._unsubscribeGarbageCollector
    )
  }

  getJWTToken(): string | null {
    return this._jwtToken
  }

  getApiKey(): string | null {
    return this._apiKey
  }

  getApiURL(): string | null {
    return this._apiUrl ? this._apiUrl.toString() : null
  }

  getRealtimeApiURL(): string | null {
    return this._realtimeApiUrl ? this._realtimeApiUrl.toString() : null
  }

  addKeyPairItem(newItem: KeyPairItem): KeyPairItem[] {
    if (!this._mapKeyPairs) this._mapKeyPairs = []

    const index = this._mapKeyPairs.findIndex((keypair: KeyPairItem) => {
      return keypair.id.toLowerCase() === newItem.id.toLowerCase()
    })

    if (index === -1) this._mapKeyPairs.push(newItem)

    return this._mapKeyPairs
  }

  removeKeyPairItem(id: string): KeyPairItem[] {
    if (!this._mapKeyPairs) this._mapKeyPairs = []

    const index = this._mapKeyPairs.findIndex((keypair: KeyPairItem) => {
      return keypair.id.toLowerCase() === id.toLowerCase()
    })

    if (index > -1) this._mapKeyPairs = this._mapKeyPairs.splice(index, 1)

    return this._mapKeyPairs
  }

  getKeyPairMap(): KeyPairItem[] {
    return this._mapKeyPairs!
  }

  setKeyPairMap(map: KeyPairItem[]): void {
    this._mapKeyPairs = map
  }

  findPublicKeyById(id: string): Maybe<forge.pki.rsa.PublicKey> {
    if (!this._mapKeyPairs) return null

    const item = this._mapKeyPairs.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return item.keypair.publicKey
  }

  findPrivateKeyById(id: string): Maybe<forge.pki.rsa.PrivateKey> {
    if (!this._mapKeyPairs) return null

    const item = this._mapKeyPairs.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return item.keypair.privateKey
  }

  findKeyPairById(id: string): Maybe<forge.pki.rsa.KeyPair> {
    if (!this._mapKeyPairs) return null

    const item = this._mapKeyPairs.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return item.keypair
  }
}
