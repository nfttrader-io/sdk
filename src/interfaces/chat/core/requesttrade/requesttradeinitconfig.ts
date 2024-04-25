import { Client } from "@urql/core"

export interface RequestTradeInitConfig {
  id: string
  conversationId: string
  createdAt: Date
  creatorsIds: string[]
  initializatorsIds: string[]
  deletedAt: Date | null
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "RENT" | "TRADE"
  updatedAt: Date | null
  userId: string
  client: Client
}
