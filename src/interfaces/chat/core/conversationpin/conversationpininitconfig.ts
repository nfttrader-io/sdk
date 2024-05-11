import { Client } from "@urql/core"
import { Conversation } from "../../../../core/chat"

export interface ConversationPinInitConfig {
  id: string
  userId: string
  conversationId: string
  conversation: Conversation
  createdAt: Date
  client: Client
}
