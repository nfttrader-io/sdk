import { Detail } from "./detail"
import { Master } from "./master"
import TradeParameters from "./tradeParameters"

/**
 * Represents a trade detail object that includes master, detail, and parameters information.
 */
export type TradeDetail = {
  /**
   * @property {Array<Master>} master - An array of Master objects.
   */
  master: Array<Master>
  /**
   * @property {Array<Detail>} detail - An array of Detail objects.
   */
  detail: Array<Detail>
  /**
   * @property {Object} parameters - Trade parameters object.
   */
  parameters: {
    /**
     * @property {string} parameters.addressMaker - The address of the maker in the trade.
     */
    addressMaker: string
    /**
     * @property {string} parameters.addressTaker - The address of the taker in the trade.
     */
    addressTaker: string
    /**
     * @property {Object} parameters.order - Order details object.
     */
    order: {
      /**
       * @property {string} parameters.order.orderHash - The hash of the order.
       */
      orderHash: string
      /**
       * @property {TradeParameters} parameters.order.parameters
       */
      parameters: TradeParameters
      /**
       * @property {string} parameters.order.signature - the signature of the order.
       */
      signature: string
    }
  }
}
