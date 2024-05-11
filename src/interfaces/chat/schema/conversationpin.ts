import { Conversation } from "../../../core/chat"

export interface ConversationPinSchema {
  id: string
  userId: string
  //#user
  conversationId: string
  conversation: Conversation
  createdAt: Date
}
