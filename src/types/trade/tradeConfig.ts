/**
 * Represents the configuration settings for a trade.
 */
type TradeConfig = {
  /**
   * @property {string} [backendURL] - The URL of the backend server.
   */
  backendURL?: string

  /**
   * @property {number} [minBlocksRequired] - The minimum number of blocks required for consider the tx valid.
   */
  minBlocksRequired?: number
}

export { TradeConfig }
