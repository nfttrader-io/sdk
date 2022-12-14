import { ethers } from "ethers"
import TradeClientDefaultInit from "./tradeClientDefaultInit"

type TradeClientWeb3Init = {
  /**
   * The handler object for the interaction with the chain.
   */
  web3Provider: ethers.providers.ExternalProvider
} & TradeClientDefaultInit

export default TradeClientWeb3Init
