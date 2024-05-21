import { TradeOrder } from "./tradeorder"

/**
 * Represents the response object for a user's trades list.
 * @interface UserTradesListResponse
 */
export interface UserTradesListResponse {
  /**
   * @property {Array<TradeOrder>} tradeList - An array of TradeOrder objects representing the user's trades.
   */
  tradeList: Array<TradeOrder>
  /**
   * @property {number} count - The total count of trades in the list.
   */
  count: number
}
