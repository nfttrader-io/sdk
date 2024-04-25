import { Client } from "@urql/core"

export interface MessageReportInitConfig {
  id: string
  description: string
  messageReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Date | null
  client: Client
}
