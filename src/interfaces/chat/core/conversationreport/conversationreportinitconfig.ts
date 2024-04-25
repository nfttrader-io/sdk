import { Client } from "@urql/core"

export interface ConversationReportInitConfig {
  id: string
  description: string
  conversationReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Date | null
  client: Client
}
