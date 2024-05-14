import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationTradingPoolInitConfig } from "../../interfaces/chat/core/conversationtradingpool"
import { ConversationTradingPoolSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class ConversationTradingPool
  extends Engine
  implements ConversationTradingPoolSchema
{
  readonly id: string
  readonly conversationId: Maybe<string>
  readonly userId: Maybe<string>
  readonly creatorsIds: Maybe<Array<Maybe<string>>>
  readonly initializatorsIds: Maybe<Array<Maybe<string>>>
  readonly operation: Maybe<JSON>
  readonly status: Maybe<
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  >
  readonly type: Maybe<"RENT" | "TRADE">
  readonly createdAt: Maybe<Date>
  readonly updatedAt: Maybe<Date>
  readonly deletedAt: Maybe<Date>

  constructor(config: ConversationTradingPoolInitConfig & EngineInitConfig) {
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
