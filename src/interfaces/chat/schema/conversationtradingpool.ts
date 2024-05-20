import Maybe from "../../../types/general/maybe"

/**
 * Represents the schema for a conversation trading pool.
 * @interface ConversationTradingPoolSchema
 */
export interface ConversationTradingPoolSchema {
  /**
   * @property {string} id - The unique identifier for the trading pool.
   */
  id: string
  /**
   * @property {string | null} conversationId - The ID of the conversation associated with the trading pool.
   */
  conversationId: Maybe<string>
  /**
   * @property {string | null} userId - The ID of the user associated with the trading pool.
   */
  userId: Maybe<string>
  /**
   * @property {Array<string> | null} creatorsIds - An array of user IDs who are creators of the trading pool.
   */
  creatorsIds: Maybe<Array<Maybe<string>>>
  /**
   * @property {Array<string> | null} initializatorsIds - An array of user IDs who are initializers of the trading pool.
   */
  initializatorsIds: Maybe<Array<Maybe<string>>>
  /**
   * @property {JSON | null} operation - The JSON object representing the operation of the user.
   */
  operation: Maybe<JSON>
  /**
   * @property {Maybe<"TRADE_INITIALIZED" | "TRADE_CONFIRMED" | "TRADE_PROGRESS" | "TRADE_COMPLETED">} status - Represents a trade status.
   */
  status: Maybe<
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  >
  /**
   * @property {Maybe<"TRADE" | "RENT">} type - Represents a type that can be either "TRADE" or "RENT", or may be undefined.
   */
  type: Maybe<"TRADE" | "RENT">
  /**
   * @property {Maybe<Date>} createdAt - The date when the conversation trading pool were created.
   */
  createdAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} updatedAt - The date when the conversation trading pool were updated.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt - The date when the conversation trading pool were deleted.
   */
  deletedAt: Maybe<Date>
}
