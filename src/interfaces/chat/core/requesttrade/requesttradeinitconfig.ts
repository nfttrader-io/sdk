import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface RequestTradeInitConfig {
  id: string
  conversationId: string
  userId: string
  creatorsIds: string[]
  initializatorsIds: string[]
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "RENT" | "TRADE"
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
  client: Client
}
