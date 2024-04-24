import { MessageReport as IMessageReport } from "../../interfaces/chat/messagereport"

export interface MessageReportInitConfig {
  id: string
  description: string
  messageReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Date | null
}

export class MessageReport implements IMessageReport {
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
