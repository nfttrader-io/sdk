import { Client } from "@urql/core"
import { Message } from "../../../../core/chat"

export interface MessageImportantInitConfig {
  id: string
  userId: string
  messageId: string
  message: Message
  conversationId: string
  createdAt: Date
  client: Client
}
