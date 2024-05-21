import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"

/**
 * Represents the configuration for initializing a conversation trading pool.
 * @interface ConversationTradingPoolInitConfig
 */
export interface ConversationTradingPoolInitConfig {
  /**
   * @property {string} id - The unique identifier for the trading pool.
   */
  id: string
  /**
   * @property {Maybe<string>} conversationId - The ID of the conversation associated with the trading pool.
   */
  conversationId: Maybe<string>
  /**
   * @property {Maybe<string>} userId - The ID of the user associated with the trading pool.
   */
  userId: Maybe<string>
  /**
   * @property {Maybe<Array<string>>} creatorsIds - An array of user IDs who are creators of the trading pool.
   */
  creatorsIds: Maybe<Array<Maybe<string>>>
  /**
   * @property {Maybe<Array<string>>} initializatorsIds - An array of user IDs who are initializers of the trading pool.
   */
  initializatorsIds: Maybe<Array<Maybe<string>>>
  /**
   * @property {Maybe<JSON>} operation - The JSON object representing the operation of the trading pool.
   */
  operation: Maybe<JSON>
  /**
   * @property {Maybe<"TRADE_INITIALIZED" | "TRADE_CONFIRMED" | "TRADE_PROGRESS" | "TRADE_COMPLETED">} status - The status of the trade.
   */
  status: Maybe<
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  >
  /**
   * @property {Maybe<"RENT" | "TRADE">} type - The type of trade.
   */
  type: Maybe<"RENT" | "TRADE">
  /**
   * @property {Maybe<Date>} createdAt - The date and time when the trade was created.
   */
  createdAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} updatedAt - The date and time when the trade was last updated.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt - The date and time when the trade was deleted.
   */
  deletedAt: Maybe<Date>
  /**
   * @property {Client} client - The client associated with the trade.
   */
  client: Client
}
