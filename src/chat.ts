import HTTPClient from "./lib/httpClient"
import { ChatConfig } from "./types/chat/chatConfig"
import { Client, cacheExchange, fetchExchange } from "@urql/core"

export default class Chat extends HTTPClient {
  private _jwtToken: string | null = null
  private _apiKey: string | null = null
  private _graphQLEndpoint: string | null = null
  private _graphQLRealtimeEndpoint: string | null = null
  private _realTimeAuthorizationToken: string | null = null
  private _client: Client | null = null

  constructor(config: ChatConfig) {
    super()
    this._jwtToken = config.jwtToken
    this._apiKey = config.apiKey
    this._graphQLEndpoint = config.graphQLEndpoint
    this._graphQLRealtimeEndpoint = config.graphQLRealtimeEndpoint
    this._realTimeAuthorizationToken = `${this._apiKey}##${this._jwtToken}`

    try {
      this._client = new Client({
        url: this._graphQLEndpoint,
        fetchOptions: () => {
          return {
            headers: { Authorization: `${this._apiKey}` },
          }
        },
        exchanges: [cacheExchange, fetchExchange],
      })
    } catch (err) {
      console.error(err)
    }
  }
}
