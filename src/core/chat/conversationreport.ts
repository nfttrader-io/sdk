import { ConversationReport as IConversationReport } from "../../interfaces/chat/schema/conversationreport"

export interface ConversationReportInitConfig {
  id: string
  description: string
  conversationReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Date | null
}

export class ConversationReport implements IConversationReport {
  id: string
  description: string
  conversationReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Date | null

  constructor(config: ConversationReportInitConfig) {
    this.id = config.id
    this.description = config.description
    this.conversationReportsId = config.conversationReportsId
    this.userId = config.userId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
  }
}
