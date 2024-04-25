import { Message as IMessage } from "../../interfaces/chat/schema/message"

export interface MessageInitConfig {
  id: string
  content: string
  conversationId: string
  userId: string
  messageRootId: string | null
  type: "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT"
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export class Message implements IMessage {
  id: string
  content: string
  conversationId: string
  userId: string
  messageRootId: string | null
  type: "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT"
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null

  constructor(config: MessageInitConfig) {
    this.id = config.id
    this.content = config.content
    this.conversationId = config.conversationId
    this.userId = config.userId
    this.messageRootId = config.messageRootId
    this.type = config.type
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt
  }
}
