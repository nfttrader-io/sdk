import Maybe from "../../../types/general/maybe"

export interface RequestTradeSchema {
  id: string
  conversationId: string
  userId: string
  creatorsIds: Array<string>
  initializatorsIds: Array<string>
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "TRADE" | "RENT"
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
