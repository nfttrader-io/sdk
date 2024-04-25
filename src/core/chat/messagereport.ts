import { MessageReportInitConfig } from "../../interfaces/chat/core/message/messageinitconfig"
import { MessageReportSchema } from "../../interfaces/chat/schema"

export class MessageReport implements MessageReportSchema {
  id: string
  description: string
  messageReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Date | null

  constructor(config: MessageReportInitConfig) {
    this.id = config.id
    this.description = config.description
    this.messageReportsId = config.messageReportsId
    this.userId = config.userId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
  }
}
