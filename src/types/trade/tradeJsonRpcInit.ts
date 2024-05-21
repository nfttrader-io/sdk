import { TradeDefaultInit } from "./tradedefaultinit"

type TradeJsonRpcInit = {
  /**
   * @property {string} jsonRpcProvider - The RPC provider URL.
   */
  jsonRpcProvider: string
} & TradeDefaultInit

export { TradeJsonRpcInit }
