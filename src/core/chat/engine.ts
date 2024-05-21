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
  /**
   * @property {Maybe<string>} _jwtToken - The JWT token for authentication.
   */
  protected _jwtToken: Maybe<string> = null
  /**
   * @property {Maybe<string>} _apiKey - The API key for authentication.
   */
  protected _apiKey: Maybe<string> = null
  /**
   * @property {Maybe<URL>} _apiUrl - The URL for the API.
   */
  protected _apiUrl: Maybe<URL> = null
  /**
   * @property {Maybe<URL>} _realtimeApiUrl - The URL for the real-time API.
   */
  protected _realtimeApiUrl: Maybe<URL> = null
  /**
   * @property {Maybe<string>} _realtimeAuthorizationToken - The authorization token for real-time API.
   */
  protected _realtimeAuthorizationToken: Maybe<string> = null
  /**
   * @property {Maybe<EngineInitConfig>} _parentConfig - The parent configuration for the engine.
   */
  protected _parentConfig: Maybe<EngineInitConfig> = null
  /**
   * @property {Maybe<Client>} _client - The client for API connections.
   */
  protected _client: Maybe<Client> = null
  /**
   * @property {Maybe<UUIDSubscriptionClient>} _realtimeClient - The UUID subscription client for real-time communication.
   */
  protected _realtimeClient: Maybe<UUIDSubscriptionClient> = null
  /**
   * @property {Maybe<forge.pki.rsa.KeyPair>} _userKeyPair - The RSA key pair for the user.
   */
  protected _userKeyPair: Maybe<forge.pki.rsa.KeyPair> = null
  /**
   * @property {Maybe<Array<KeyPairItem>>} _keyPairsMap - An array of key pair items.
   */
  protected _keyPairsMap: Maybe<Array<KeyPairItem>> = null
  /**
   * @property {Maybe<Function>} _connectCallback - The callback function for connecting to real-time services.
   */
  private _connectCallback: Maybe<Function> = null
  /**
   * @property {Maybe<RealTimeWebSocketConnectionParams>} _connectionParams - The connection parameters for the WebSocket.
   */
  private _connectionParams: Maybe<RealTimeWebSocketConnectionParams> = null
  /**
   * @property {Maybe<Array<Function>>} _offEventsFns - an array of off functions callback to remove the listeners from the subscription object
   */
  private _offEventsFnsCollector: Maybe<Array<Function>> = null
  /**
   * @property {Maybe<Array<SubscriptionGarbage>>} _unsubscribeGarbageCollector - an array of unsubscribe functions callback to remove the listeners from the subscription object
   */
  private _unsubscribeGarbageCollector: Maybe<Array<SubscriptionGarbage>> = null
  /**
   * @property {number} WS_TIMEOUT - a static property representing the timeout before to close to the websocket connection
   */
  static readonly WS_TIMEOUT = 300000 //five minutes

  /**
   * Constructs a new instance of the Engine class with the provided configuration.
   * @param {EngineInitConfig} config - The configuration object for initializing the Engine.
   * @constructor
   */
  constructor(config: EngineInitConfig) {
    super()

    this._jwtToken = config.jwtToken
    this._apiKey = config.apiKey
    this._apiUrl = new URL(config.apiUrl)
    this._realtimeApiUrl = new URL(config.realtimeApiUrl)
    this._realtimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`
    this._keyPairsMap = config.keyPairsMap
    this._userKeyPair = config.userKeyPair
    this._parentConfig = config
    this._connectionParams = {
      Authorization: null,
      host: null,
    }
    this._offEventsFnsCollector = []
    this._unsubscribeGarbageCollector = []
  }

  /**
   * Returns a QIError object with a specific message indicating that the internal _client is not defined.
   * @returns {QIError} A QIError object with the specified message.
   */
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

  /**
   * Returns a QIError object with a message indicating that no data is available in the response.
   * @returns {QIError} - A QIError object with the specified message.
   */
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

  /**
   * Removes duplicated objects from the SubscriptionGarbage array based on the 'uuid' property.
   * @param {SubscriptionGarbage[]} objects - An array of SubscriptionGarbage objects.
   * @returns {SubscriptionGarbage[]} - An array of unique SubscriptionGarbage objects.
   */
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

  /**
   * Handles the WebSocket client events by setting up event listeners for various events
   * such as connecting, reconnecting, disconnected, reconnected, error, and connected.
   * If the WebSocket client or event listener collector is not available, the function returns early.
   * @returns None
   */
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

  /**
   * Creates a WebSocket client with the provided callback function.
   * @param {Function} callback - The callback function to be executed.
   * @returns None
   */
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

  /**
   * Computes the operation to be performed based on the provided fetch body and data.
   * @param {FetchBody & { data?: string }} operation - The operation to be computed.
   * @returns An Observable containing the result of the operation.
   */
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

  /**
   * Creates a client for making API requests if all required parameters are set.
   * @returns {Maybe<Client>} A client object for making API requests or null if any required parameter is missing.
   */
  private _makeClient(): Maybe<Client> {
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

  /**
   * Resets the state of the object by unsubscribing from all events, closing the realtime client,
   * and executing a callback function.
   * @param {Function} callback - The function to be executed after resetting the state.
   * @returns None
   */
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

  /**
   * Clears all subscription off events by calling the functions stored in _offEventsFnsCollector.
   * If an error occurs during the process, a warning message is logged.
   * @returns void
   */
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

  /**
   * Private method to unsubscribe from garbage collector subscriptions.
   * If there are subscriptions in the garbage collector, it unsubscribes from each one.
   * If an error occurs during the unsubscribe process, a warning is logged.
   * @returns void
   */
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

  /**
   * Handles the response from an operation result and returns the data or an error.
   * @param {K} queryName - The name of the query.
   * @param {OperationResult<T>} response - The response from the operation.
   * @returns {R | QIError} - The data or an error object.
   */
  protected _handleResponse<K extends string, T extends { [key in K]: any }, R>(
    queryName: K,
    response: OperationResult<T>
  ): R | QIError {
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

  /**
   * Executes a subscription operation with the provided arguments and returns a subscription object
   * or a QIError in case of an error.
   * @param {TypedDocumentNode<any, AnyVariables>} node - The GraphQL document node representing the subscription operation.
   * @param {string} __functionName - The name of the function executing the subscription.
   * @param {TArgs} args - The arguments for the subscription operation.
   * @returns {Object | QIError} An object containing the subscription and UUID or a QIError in case of an error.
   */
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

  /**
   * Executes a mutation operation using Apollo Client with the provided arguments.
   * @param {string} key - The key associated with the mutation operation.
   * @param {TypedDocumentNode<any, AnyVariables>} node - The GraphQL document node representing the mutation.
   * @param {string} __functionName - The name of the function calling the mutation.
   * @param {TArgs} args - The arguments required for the mutation operation.
   * @returns {Promise<TResult | QIError>} A promise that resolves to the result of the mutation or an error.
   * @throws {Error} Throws an error if an exception occurs during the mutation operation.
   */
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

  /**
   * Executes a query using Apollo Client with the provided key, node, function name, and arguments.
   * @param {string} key - The key for the query.
   * @param {TypedDocumentNode<any, AnyVariables>} node - The GraphQL document node for the query.
   * @param {string} __functionName - The name of the function executing the query.
   * @param {TArgs} args - The arguments for the query.
   * @returns {Promise<TResult | QIError>} A promise that resolves with the query result or an error.
   */
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

  /**
   * Refreshes the JWT token with the provided token and updates the realtime authorization token.
   * @param {string} jwt - The new JWT token to be set.
   * @returns void
   */
  refreshJWTToken(jwt: string): void {
    this._jwtToken = jwt
    this._realtimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`
  }

  /**
   * Reconnects to a service by resetting and then connecting again.
   * @param {Function} callback - The callback function to be executed after reconnecting.
   * @returns void
   */
  reconnect(callback: Function): void {
    this._reset(() => {
      this.connect(callback)
    })
  }

  /**
   * Connects to a WebSocket server and executes the provided callback function.
   * @param {Function} callback - The callback function to be executed after connecting to the WebSocket server.
   * @returns void
   */
  connect(callback: Function): void {
    this._makeWSClient(callback)
  }

  /**
   * Collects subscription garbage to be unsubscribed later.
   * @param {SubscriptionGarbage | SubscriptionGarbage[]} garbage - The subscription garbage or array of garbage to collect.
   * @returns None
   */
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

  /**
   * Get the JWT token stored in the class instance.
   * @returns The JWT token as a string, or null if it is not set.
   */
  getJWTToken(): Maybe<string> {
    return this._jwtToken
  }

  /**
   * Get the API key.
   * @returns {Maybe<string>} The API key, or null if it is not set.
   */
  getApiKey(): Maybe<string> {
    return this._apiKey
  }

  /**
   * Returns the API URL as a string or null if it is not set.
   * @returns {Maybe<string>} The API URL as a string or null if not set.
   */
  getApiURL(): Maybe<string> {
    return this._apiUrl ? this._apiUrl.toString() : null
  }

  /**
   * Returns the Realtime API URL as a string or null if it is not set.
   * @returns {Maybe<string>} The Realtime API URL as a string or null.
   */
  getRealtimeApiURL(): Maybe<string> {
    return this._realtimeApiUrl ? this._realtimeApiUrl.toString() : null
  }

  /**
   * Adds a new KeyPairItem to the list of KeyPairItems if it does not already exist.
   * @param {KeyPairItem} newItem - The KeyPairItem to add to the list.
   * @returns {KeyPairItem[]} - The updated list of KeyPairItems after adding the new item.
   */
  addKeyPairItem(newItem: KeyPairItem): KeyPairItem[] {
    if (!this._keyPairsMap) this._keyPairsMap = []

    const index = this._keyPairsMap.findIndex((keypair: KeyPairItem) => {
      return keypair.id.toLowerCase() === newItem.id.toLowerCase()
    })

    if (index === -1) this._keyPairsMap.push(newItem)

    return this._keyPairsMap
  }

  /**
   * Removes a KeyPairItem from the _keyPairsMap based on the provided id.
   * @param {string} id - The id of the KeyPairItem to be removed.
   * @returns {KeyPairItem[]} - The updated _keyPairsMap after removing the KeyPairItem.
   */
  removeKeyPairItem(id: string): KeyPairItem[] {
    if (!this._keyPairsMap) this._keyPairsMap = []

    const index = this._keyPairsMap.findIndex((keypair: KeyPairItem) => {
      return keypair.id.toLowerCase() === id.toLowerCase()
    })

    if (index > -1) this._keyPairsMap = this._keyPairsMap.splice(index, 1)

    return this._keyPairsMap
  }

  /**
   * Get the key pair map as an array of KeyPairItem objects.
   * @returns {KeyPairItem[]} An array of KeyPairItem objects representing the key pair map.
   */
  getKeyPairMap(): KeyPairItem[] {
    return this._keyPairsMap!
  }

  /**
   * Sets the key pair map with the provided array of KeyPairItem objects.
   * @param {KeyPairItem[]} map - An array of KeyPairItem objects to set as the key pair map.
   * @returns void
   */
  setKeyPairMap(map: KeyPairItem[]): void {
    this._keyPairsMap = map
  }

  /**
   * Finds a public key by its ID in the key pairs map.
   * @param {string} id - The ID of the public key to find.
   * @returns {Maybe<forge.pki.rsa.PublicKey>} The public key associated with the given ID,
   * or null if the key pairs map is empty or if the key with the specified ID is not found.
   */
  findPublicKeyById(id: string): Maybe<forge.pki.rsa.PublicKey> {
    if (!this._keyPairsMap) return null

    const item = this._keyPairsMap.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return item.keypair.publicKey
  }

  /**
   * Finds a private key by its ID in the key pairs map.
   * @param {string} id - The ID of the private key to find.
   * @returns {Maybe<forge.pki.rsa.PrivateKey>} The private key associated with the given ID,
   * or null if the key is not found.
   */
  findPrivateKeyById(id: string): Maybe<forge.pki.rsa.PrivateKey> {
    if (!this._keyPairsMap) return null

    const item = this._keyPairsMap.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return item.keypair.privateKey
  }

  /**
   * Finds a key pair in the key pairs map based on the provided ID.
   * @param {string} id - The ID of the key pair to find.
   * @returns {Maybe<forge.pki.rsa.KeyPair>} The key pair associated with the provided ID, or null if not found.
   */
  findKeyPairById(id: string): Maybe<forge.pki.rsa.KeyPair> {
    if (!this._keyPairsMap) return null

    const item = this._keyPairsMap.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return item.keypair
  }

  /**
   * Sets the user key pair for encryption and decryption.
   * @param {forge.pki.rsa.KeyPair} userKeyPair - The RSA key pair for the user.
   * @returns {void}
   */
  setUserKeyPair(userKeyPair: forge.pki.rsa.KeyPair): void {
    this._userKeyPair = userKeyPair
  }

  /**
   * Get the user's key pair.
   * @returns {Maybe<forge.pki.rsa.KeyPair>} The user's key pair, if available.
   */
  getUserKeyPair(): Maybe<forge.pki.rsa.KeyPair> {
    return this._userKeyPair
  }
}
