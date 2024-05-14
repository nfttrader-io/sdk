import { EngineInitConfig } from "../../interfaces/chat/core"
import { MessageImportantInitConfig } from "../../interfaces/chat/core/messageimportant"
import { MessageImportantSchema } from "../../interfaces/chat/schema"
import { Engine } from "./engine"
import { Message } from "./message"

export class MessageImportant extends Engine implements MessageImportantSchema {
  readonly id: string
  readonly userId: string
  readonly messageId: string
  readonly conversationId: string
  readonly createdAt: Date
  readonly message: Message

  constructor(config: MessageImportantInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })

    this.id = config.id
    this.userId = config.userId
    this.messageId = config.messageId
    this.message = config.message
    this.conversationId = config.conversationId
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
