import Network from "../general/network"
import TradeClientJsonRpcInit from "./tradeClientJsonRPCInit"
import TradeClientWeb3Init from "./tradeClientWeb3Init"

type TradeClientInit = (TradeClientJsonRpcInit | TradeClientWeb3Init) & {
  /**
   * The network of the chain.
   */
  network: Network
  /**
   * The number of the mined blocks to wait for considering a transaction valid.
   *
   * @defaultValue - based on network (7 for ethereum and 35 for polygon and mumbai)
   */
  blocksNumberConfirmationRequired?: number
}

export default TradeClientInit
