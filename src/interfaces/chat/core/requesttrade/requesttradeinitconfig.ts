import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface RequestTradeInitConfig {
  id: string
  conversationId: string
  createdAt: Date
  creatorsIds: string[]
  initializatorsIds: string[]
  deletedAt: Maybe<Date>
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "RENT" | "TRADE"
  updatedAt: Maybe<null>
  userId: string
  client: Client
}
