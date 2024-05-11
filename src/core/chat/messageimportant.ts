import { EngineInitConfig } from "../../interfaces/chat/core"
import { MessageImportantInitConfig } from "../../interfaces/chat/core/messageimportant"
import { MessageImportantSchema } from "../../interfaces/chat/schema"
import { Engine } from "./engine"

export class MessageImportant extends Engine implements MessageImportantSchema {
  readonly id: string
  readonly userId: string
  readonly messageId: string
  readonly conversationId: string
  readonly createdAt: Date

  constructor(config: MessageImportantInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.userId = config.userId
    this.messageId = config.messageId
    this.conversationId = config.conversationId
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
