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
  readonly description: Maybe<string>
  readonly userId: Maybe<string>
  readonly createdAt: Date

  constructor(config: ConversationReportInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })

    this.id = config.id
    this.description = config.description
    this.userId = config.userId
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
