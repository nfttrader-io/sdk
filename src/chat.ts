import HTTPClient from "./core/httpClient"
import { ChatConfig } from "./types/chat/chatConfig"
import { Client, CombinedError, cacheExchange, fetchExchange } from "@urql/core"
import { addBlockedUser } from "./constants/chat/mutations"
import { getConversationById } from "./constants/chat/queries"
import {
  Conversation as ConversationGraphQL,
  Maybe,
  MutationAddBlockedUserArgs,
  QueryGetConversationByIdArgs,
  User as UserGraphQL,
} from "./graphql/generated/graphql"
import { User } from "./core/chat/user"
import { QIError } from "./core/chat/qierror"

export default class Chat extends HTTPClient {
  private _jwtToken: string | null = null
  private _apiKey: string | null = null
  private _apiUrl: string | null = null
  private _realtimeApiUrl: string | null = null
  private _realTimeAuthorizationToken: string | null = null
  private _client: Client | null = null

  constructor(config: ChatConfig) {
    super()
    this._jwtToken = config.jwtToken
    this._apiKey = config.apiKey
    this._apiUrl = config.apiUrl
    this._realtimeApiUrl = config.realtimeApiUrl
    this._realTimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`

    try {
      this._client = new Client({
        url: this._apiUrl,
        fetchOptions: () => {
          return {
            headers: {
              Authorization: `${this._apiKey}`,
            },
          }
        },
        exchanges: [cacheExchange, fetchExchange],
      })
    } catch (err) {
      console.error(err)
    }
  }

  public async blockUser(id: string): Promise<QIError | User> {
    const operation = await this._addBlockedUser({ blockId: id })

    if (operation instanceof QIError) return operation
  }

  private _callClient(): Client {
    if (this._client) return this._client

    throw new Error("Client instance is not initialized.")
  }

  private async _addBlockedUser(
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

  private async test(
    args: QueryGetConversationByIdArgs
  ): Promise<Maybe<ConversationGraphQL>> {
    const a = await this._callClient()
      .query<ConversationGraphQL, any>(getConversationById, {
        ...args,
        jwt: `${this._jwtToken}`,
      })
      .toPromise()
    console.log(getConversationById)
    console.log(a)

    if (a?.error) {
    } else {
      if (a && a.data) return a.data
    }

    return null
  }

  public async a() {
    const b = await this.test({
      conversationId: "3dc4a129-fecc-4c02-852a-53cd3765e0d3",
    })
  }
}
