import { Message } from "../../../core/chat"

export interface MessageImportantSchema {
  id: string
  userId: string
  //#user
  messageId: string
  message: Message
  conversationId: string
  //#conversation
  createdAt: Date
}
