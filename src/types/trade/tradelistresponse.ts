import { TradeOrder } from "../../interfaces/trade/tradeorder"

/**
 * Represents the response object for the global trades list.
 * @interface TradeListResponse
 */
export interface TradeListResponse {
  /**
   * @property {Array<TradeOrder>} tradeList - An array of TradeOrder objects representing the trades.
   */
  tradeList: Array<TradeOrder>
  /**
   * @property {number} count - The total count of trades in the list.
   */
  count: number
}
