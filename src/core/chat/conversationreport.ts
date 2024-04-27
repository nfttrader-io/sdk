import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationReportInitConfig } from "../../interfaces/chat/core/conversationreport"
import { ConversationReportSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class ConversationReport
  extends Engine
  implements ConversationReportSchema
{
  readonly id: string
  readonly description: string
  readonly conversationReportsId: string
  readonly userId: string
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>

  constructor(config: ConversationReportInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.description = config.description
    this.conversationReportsId = config.conversationReportsId
    this.userId = config.userId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this._client = config.client
  }
}
