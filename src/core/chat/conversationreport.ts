import { ConversationReportInitConfig } from "../../interfaces/chat/core/conversationreport/conversationreportinitconfig"
import { ConversationReportSchema } from "../../interfaces/chat/schema"

export class ConversationReport implements ConversationReportSchema {
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
