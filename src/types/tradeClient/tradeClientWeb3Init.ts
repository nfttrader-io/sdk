import { ethers } from "ethers"

export default interface TradeClientWeb3Init {
  /**
   * The handler object for the interaction with the chain.
   */
  web3Provider: ethers.providers.ExternalProvider
}
