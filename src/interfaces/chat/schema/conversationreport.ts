export interface ConversationReportSchema {
  id: string
  description: string
  conversationReportsId: string
  //#user
  userId: string
  createdAt: Date
  updatedAt: Date | null
}
