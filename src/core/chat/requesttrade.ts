import { EngineInitConfig } from "../../interfaces/chat/core"
import { RequestTradeInitConfig } from "../../interfaces/chat/core/requesttrade/requesttradeinitconfig"
import { RequestTradeSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class RequestTrade extends Engine implements RequestTradeSchema {
  readonly id: string
  readonly conversationId: string
  readonly createdAt: Date
  readonly creatorsIds: string[]
  readonly initializatorsIds: string[]
  readonly deletedAt: Maybe<Date>
  readonly operation: JSON
  readonly status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  readonly type: "RENT" | "TRADE"
  readonly updatedAt: Maybe<Date>
  readonly userId: string

  constructor(config: RequestTradeInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.conversationId = config.conversationId
    this.createdAt = config.createdAt
    this.creatorsIds = config.creatorsIds
    this.initializatorsIds = config.initializatorsIds
    this.deletedAt = config.deletedAt
    this.operation = config.operation
    this.status = config.status
    this.type = config.type
    this.updatedAt = config.updatedAt
    this.userId = config.userId
    this._client = config.client
  }
}
