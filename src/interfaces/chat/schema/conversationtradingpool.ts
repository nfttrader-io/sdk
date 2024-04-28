import Maybe from "../../../types/general/maybe"

export interface ConversationTradingPoolSchema {
  id: string
  conversationId: Maybe<string>
  userId: Maybe<string>
  creatorsIds: Maybe<Array<Maybe<string>>>
  initializatorsIds: Maybe<Array<Maybe<string>>>
  operation: Maybe<JSON>
  status: Maybe<
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  >
  type: Maybe<"TRADE" | "RENT">
  createdAt: Maybe<Date>
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
