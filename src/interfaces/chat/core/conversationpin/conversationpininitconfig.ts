import { Client } from "@urql/core"

export interface ConversationPinInitConfig {
  id: string
  userId: string
  conversationId: string
  createdAt: Date
  client: Client
}
