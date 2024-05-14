import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationPinInitConfig } from "../../interfaces/chat/core/conversationpin"
import { ConversationPinSchema } from "../../interfaces/chat/schema"
import { Conversation } from "./conversation"
import { Engine } from "./engine"

export class ConversationPin extends Engine implements ConversationPinSchema {
  readonly id: string
  readonly userId: string
  readonly conversationId: string
  readonly createdAt: Date
  readonly conversation: Conversation

  constructor(config: ConversationPinInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.userId = config.userId
    this.conversationId = config.conversationId
    this.conversation = config.conversation
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
