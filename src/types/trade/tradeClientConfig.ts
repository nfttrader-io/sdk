type TradeClientConfig = {
  /**
   * the backend endpoint
   */
  backendURL?: string

  /**
   * min blocks number required to consider a valid transaction
   */
  minBlocksRequired?: number
}

export default TradeClientConfig
