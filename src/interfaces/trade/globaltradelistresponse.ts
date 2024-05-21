import { TradeOrder } from "./tradeorder"

/**
 * Represents the response object for the global trades list.
 * @interface GlobalTradesListResponse
 */
export interface GlobalTradesListResponse {
  /**
   * @property {Array<TradeOrder>} tradeList - An array of TradeOrder objects representing the trades.
   */
  tradeList: Array<TradeOrder>
  /**
   * @property {number} count - The total count of trades in the list.
   */
  count: number
}
