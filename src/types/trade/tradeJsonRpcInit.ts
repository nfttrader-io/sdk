import TradeDefaultInit from "./tradeDefaultInit"

type TradeJsonRpcInit = {
  /**
   * The RPC provider URL.
   */
  jsonRpcProvider: string
} & TradeDefaultInit

export default TradeJsonRpcInit
