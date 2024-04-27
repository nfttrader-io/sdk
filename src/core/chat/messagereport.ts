import { EngineInitConfig } from "../../interfaces/chat/core"
import { MessageReportInitConfig } from "../../interfaces/chat/core/messagereport"
import { MessageReportSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class MessageReport extends Engine implements MessageReportSchema {
  readonly id: string
  readonly description: string
  readonly userId: Maybe<string>
  readonly createdAt: Date

  constructor(config: MessageReportInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.description = config.description
    this.userId = config.userId
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
