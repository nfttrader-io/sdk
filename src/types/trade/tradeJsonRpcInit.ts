import TradeDefaultInit from "./tradeDefaultInit"

type TradeJsonRpcInit = {
  /**
   * @property {string} jsonRpcProvider - The RPC provider URL.
   */
  jsonRpcProvider: string
} & TradeDefaultInit

export default TradeJsonRpcInit
