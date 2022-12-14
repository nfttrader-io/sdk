import TradeClientDefaultInit from "./tradeClientDefaultInit"

type TradeClientJsonRpcInit = {
  /**
   * The RPC provider URL.
   */
  jsonRpcProvider: string
} & TradeClientDefaultInit

export default TradeClientJsonRpcInit
