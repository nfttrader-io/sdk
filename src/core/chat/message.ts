import { EngineInitConfig } from "../../interfaces/chat/core"
import { MessageInitConfig } from "../../interfaces/chat/core/message"
import { MessageSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class Message extends Engine implements MessageSchema {
  readonly id: string
  readonly content: string
  readonly conversationId: Maybe<string>
  readonly userId: Maybe<string>
  readonly messageRootId: Maybe<string>
  readonly type: Maybe<"TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT">
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>
  readonly deletedAt: Maybe<Date>

  constructor(config: MessageInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.content = config.content
    this.conversationId = config.conversationId
    this.userId = config.userId
    this.messageRootId = config.messageRootId
    this.type = config.type
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt
    this._client = config.client
  }
}
