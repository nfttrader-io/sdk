import { Client, cacheExchange, fetchExchange } from "@urql/core"
import { QueryEngine as IQueryEngine } from "../../interfaces/chat/core/queryengine"
import HTTPClient from "../httpClient"
import { addBlockedUser } from "../../constants/chat/mutations"
import {
  Conversation as ConversationGraphQL,
  Maybe,
  MutationAddBlockedUserArgs,
  QueryGetConversationByIdArgs,
  User as UserGraphQL,
} from "../../graphql/generated/graphql"
import { QIError } from "./qierror"
import { QueryEngineInitConfig } from "../../interfaces/chat/core/queryengineinitconfig"

export class QueryEngine extends HTTPClient implements IQueryEngine {
  protected _jwtToken: string | null = null
  protected _apiKey: string | null = null
  protected _apiUrl: URL | null = null
  protected _realtimeApiUrl: URL | null = null
  protected _realtimeAuthorizationToken: string | null = null

  protected _client: Client | null = null

  constructor(config: QueryEngineInitConfig) {
    super()

    this._jwtToken = config.jwtToken
    this._apiKey = config.apiKey
    this._apiUrl = new URL(config.apiUrl)
    this._realtimeApiUrl = new URL(config.realtimeApiUrl)
    this._realtimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`
  }

  protected _callClient(): Client {
    if (this._client) return this._client

    throw new Error("Client instance is not initialized.")
  }

  protected async _addBlockedUser(
    args: MutationAddBlockedUserArgs
  ): Promise<UserGraphQL | QIError> {
    try {
      const blockedUser = await this._callClient()
        .mutation<
          { addBlockedUser: UserGraphQL },
          Required<MutationAddBlockedUserArgs> & { jwt: string }
        >(addBlockedUser, {
          ...args,
          jwt: `${this._jwtToken}`,
        })
        .toPromise()

      if (blockedUser.error) {
        return new QIError(blockedUser.error, "", true)
      } else {
        if (blockedUser.data) {
          return blockedUser.data.addBlockedUser
        } else {
          return new QIError(
            {
              networkError: undefined,
              graphQLErrors: undefined,
              response: undefined,
            },
            "no data in the response is available",
            false
          )
        }
      }
    } catch (error) {
      throw new Error(
        "Internal error: _addBlockedUser() thrown an exception. See the console to have more information."
      )
      console.error(error)
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
