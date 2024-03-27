import { ethers } from "ethers"
import TradeDefaultInit from "./tradeDefaultInit"

type TradeWeb3Init = {
  /**
   * The handler object for the interaction with the chain.
   */
  web3Provider: ethers.providers.ExternalProvider
} & TradeDefaultInit

export default TradeWeb3Init
