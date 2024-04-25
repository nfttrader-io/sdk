import {
  Client,
  OperationResult,
  cacheExchange,
  fetchExchange,
} from "@urql/core"
import { Engine as IEngine, EngineInitConfig } from "../../interfaces/chat/core"
import HTTPClient from "../httpClient"
import {
  addBlockedUser,
  addMembersToConversation,
} from "../../constants/chat/mutations"
import {
  Conversation as ConversationGraphQL,
  ListConversationMembers as ListConversationMembersGraphQL,
  Maybe,
  MutationAddBlockedUserArgs,
  MutationAddMembersToConversationArgs,
  QueryGetConversationByIdArgs,
  User as UserGraphQL,
} from "../../graphql/generated/graphql"
import { QIError } from "./qierror"
import { getConversationById } from "../../constants/chat/queries"

export class Engine extends HTTPClient implements IEngine {
  protected _jwtToken: string | null = null
  protected _apiKey: string | null = null
  protected _apiUrl: URL | null = null
  protected _realtimeApiUrl: URL | null = null
  protected _realtimeAuthorizationToken: string | null = null
  protected _parentConfig: EngineInitConfig | null = null
  protected _client: Client | null = null

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
          exchanges: [cacheExchange, fetchExchange],
        })
      } catch (error) {
        console.error(error)
        return null
      }
    }

    return this._client
  }

  protected async _addBlockedUser(
    args: MutationAddBlockedUserArgs
  ): Promise<UserGraphQL | QIError> {
    try {
      const client = this._makeClient()

      if (!client) return this._returnQIErrorInternalClientNotDefined()

      const response = await client
        .mutation<
          { addBlockedUser: UserGraphQL },
          Required<MutationAddBlockedUserArgs> & { jwt: string }
        >(addBlockedUser, {
          ...args,
          jwt: `${this._jwtToken}`,
        })
        .toPromise()

      /*
        
        if (response.error) return new QIError(response.error, "", true)

        if (
          !("data" in response) ||
          typeof response.data === "undefined" ||
          response.data === null
        )
          return new QIError(
            {
              networkError: undefined,
              graphQLErrors: undefined,
              response: undefined,
            },
            "QIError: no data in the response is available.",
            false
          )

        return response.data.addBlockedUser
        
      */

      return this._handleResponse<
        "addBlockedUser",
        { addBlockedUser: UserGraphQL },
        UserGraphQL | QIError
      >("addBlockedUser", response)
    } catch (error) {
      console.error(error)
      throw new Error(
        "Internal error: _addBlockedUser() thrown an exception. See the console to have more information."
      )
    }
  }

  protected async _addMembersToConversation(
    args: MutationAddMembersToConversationArgs
  ): Promise<ListConversationMembersGraphQL | QIError> {
    try {
      const client = this._makeClient()

      if (!client) return this._returnQIErrorInternalClientNotDefined()

      const response = await client
        .mutation<
          {
            addMembersToConversation: ListConversationMembersGraphQL
          },
          Required<MutationAddMembersToConversationArgs> & { jwt: string }
        >(addMembersToConversation, {
          ...args,
          jwt: `${this._jwtToken}`,
        })
        .toPromise()

      return this._handleResponse<
        "addMembersToConversation",
        { addMembersToConversation: ListConversationMembersGraphQL },
        ListConversationMembersGraphQL | QIError
      >("addMembersToConversation", response)
    } catch (error) {
      console.error(error)
      throw new Error(
        "Internal error: _addMembersToConversation() thrown an exception. See the console to have more information."
      )
    }
  }

  protected async _getConversationById(
    args: QueryGetConversationByIdArgs
  ): Promise<ConversationGraphQL | QIError> {
    try {
      const client = this._makeClient()

      if (!client) return this._returnQIErrorInternalClientNotDefined()

      const response = await client
        .query<
          {
            getConversationById: ConversationGraphQL
          },
          Required<QueryGetConversationByIdArgs> & { jwt: string }
        >(getConversationById, {
          ...args,
          jwt: `${this._jwtToken}`,
        })
        .toPromise()

      return this._handleResponse<
        "getConversationById",
        { getConversationById: ConversationGraphQL },
        ConversationGraphQL | QIError
      >("getConversationById", response)
    } catch (error) {
      console.error(error)
      throw new Error(
        "Internal error: _getConversationById() thrown an exception. See the console to have more information."
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
