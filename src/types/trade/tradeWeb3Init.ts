import { ethers } from "ethers"
import TradeDefaultInit from "./tradeDefaultInit"

/**
 * Represents the initialization configuration for a trade using Web3.
 */
type TradeWeb3Init = {
  /**
   * @property {ethers.providers.ExternalProvider} web3Provider - The handler object for the interaction with the chain.
   */
  web3Provider: ethers.providers.ExternalProvider
} & TradeDefaultInit

export default TradeWeb3Init
