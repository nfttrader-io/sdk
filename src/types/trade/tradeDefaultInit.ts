/**
 * Represents the default initialization options for a trade.
 */
type TradeDefaultInit = {
  /**
   * @property {number} blocksNumberConfirmationRequired - based on network (7 for ethereum and 35 for polygon and mumbai)
   */
  blocksNumberConfirmationRequired?: number
}

export default TradeDefaultInit
