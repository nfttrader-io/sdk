import { EngineInitConfig } from "../../interfaces/chat/core"
import { MessageReportInitConfig } from "../../interfaces/chat/core/messagereport"
import { MessageReportSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class MessageReport extends Engine implements MessageReportSchema {
  readonly id: string
  readonly description: string
  readonly messageReportsId: string
  readonly userId: string
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>

  constructor(config: MessageReportInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.description = config.description
    this.messageReportsId = config.messageReportsId
    this.userId = config.userId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this._client = config.client
  }
}
