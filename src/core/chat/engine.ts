import {
  AnyVariables,
  Client,
  OperationResult,
  TypedDocumentNode,
  cacheExchange,
  fetchExchange,
} from "@urql/core"
import { Engine as IEngine, EngineInitConfig } from "../../interfaces/chat/core"
import HTTPClient from "../httpClient"
import { QIError } from "./qierror"
import Maybe from "../../types/general/maybe"

export class Engine extends HTTPClient implements IEngine {
  protected _jwtToken: Maybe<string> = null
  protected _apiKey: Maybe<string> = null
  protected _apiUrl: Maybe<URL> = null
  protected _realtimeApiUrl: Maybe<URL> = null
  protected _realtimeAuthorizationToken: Maybe<string> = null
  protected _parentConfig: Maybe<EngineInitConfig> = null
  protected _client: Maybe<Client> = null

  constructor(config: EngineInitConfig) {
    super()

    this._jwtToken = config.jwtToken
    this._apiKey = config.apiKey
    this._apiUrl = new URL(config.apiUrl)
    this._realtimeApiUrl = new URL(config.realtimeApiUrl)
    this._realtimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`
    this._parentConfig = config
  }

  private _handleResponse<K extends string, T extends { [key in K]: any }, R>(
    queryName: K,
    response: OperationResult<T>
  ): R | QIError {
    if (response.error) return new QIError(response.error, "", true)

    if (
      !("data" in response) ||
      typeof response.data === "undefined" ||
      response.data === null
    )
      return this._returnQIErrorNoDataAvailable()

    return response.data[queryName] as R
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

  protected _makeClient(): Client | null {
    if (!this._jwtToken) return null
    if (!this._apiKey) return null
    if (!this._apiUrl) return null
    if (!this._client) {
      try {
        this._client = new Client({
          url: this._apiUrl.toString(),
          fetchOptions: () => {
            return {
              headers: {
                Authorization: `${this._apiKey}`,
              },
            }
          },
          exchanges: [fetchExchange],
        })
      } catch (error) {
        console.error(error)
        return null
      }
    }

    return this._client
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
}
