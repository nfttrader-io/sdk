export interface RequestTradeSchema {
  id: string
  conversationId: string
  createdAt: Date
  creatorsIds: Array<string>
  initializatorsIds: Array<string>
  deletedAt: Date | null
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "TRADE" | "RENT"
  updatedAt: Date | null
  userId: string
}
