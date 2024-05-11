export interface MessageImportantSchema {
  id: string
  userId: string
  //#user
  messageId: string
  //#message
  conversationId: string
  //#conversation
  createdAt: Date
}
