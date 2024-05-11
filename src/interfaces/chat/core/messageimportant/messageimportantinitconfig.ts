import { Client } from "@urql/core"

export interface MessageImportantInitConfig {
  id: string
  userId: string
  messageId: string
  conversationId: string
  createdAt: Date
  client: Client
}
