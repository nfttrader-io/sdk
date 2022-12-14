import * as ethers from "ethers"
import contracts from "./lib/contracts"
import events from "./lib/events"
import TradeClientEventsMap from "./types/tradeClient/eventsMap"
import CallbackParams from "./types/tradeClient/callbackParams"
import Network from "./types/general/network"
const {
  swap,
  royaltyRegistriesEngines,
  contractAbi,
  erc721Abi,
  royaltyRegistryEngineAbi,
} = contracts

export default class TradeClient {
  private provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
    | null = null
  private contractAddress: string | null = null
  private contract: ethers.Contract | null = null
  private signer: ethers.Wallet | null = null
  private isJsonRpcProvider: boolean = false
  private isWeb3Provider: boolean = false
  private blocksNumberConfirmationRequired: number = 3
  private avoidPrivateKeySigner: boolean = false
  private eventsCollectorCallbacks = events.map(
    <EventName extends keyof TradeClientEventsMap>(
      name: EventName
    ): {
      name: EventName
      callbacks: Array<TradeClientEventsMap[EventName]>
    } => ({
      name,
      callbacks: [],
    })
  )

  constructor(
    config:
      | {
          jsonRpcProvider: string
          network: Network
          signer: Record<"privateKey", string> & { [k: string]: any }
          avoidPrivateKeySigner?: boolean
        }
      | {
          web3Provider:
            | ethers.providers.ExternalProvider
            | ethers.providers.JsonRpcFetchFunc
          network: Network
        }
  ) {
    const web3Provider =
      "web3Provider" in config ? config.web3Provider : undefined
    const jsonRpcProvider =
      "jsonRpcProvider" in config ? config.jsonRpcProvider : undefined
    const { network } = config
    const signer = "signer" in config ? config.signer : undefined
    const avoidPrivateKeySigner =
      "avoidPrivateKeySigner" in config
        ? config.avoidPrivateKeySigner ?? false
        : false

    this.avoidPrivateKeySigner = avoidPrivateKeySigner

    if (web3Provider && jsonRpcProvider)
      throw new Error("just one provider at a time is supported.")

    if (
      typeof jsonRpcProvider !== "string" &&
      typeof jsonRpcProvider !== "undefined"
    )
      throw new Error(
        "jsonRpcProvider must be a string -> Eg. https://rinkeby.infura.io/v3/..."
      )

    if (typeof web3Provider === "string" && typeof web3Provider !== "undefined")
      throw new Error("web3Provider must be an object -> Eg. window.ethereum")

    if (swap[network] === void 0) throw new Error("network not supported.")

    if (typeof jsonRpcProvider === "string") {
      if (!this.avoidPrivateKeySigner) {
        if (typeof signer === "undefined" || signer === null)
          throw new Error("signer is mandatory if you use a JSON RPC Provider.")
        if (signer["privateKey"] === void 0)
          throw new Error("signer object must have a privateKey property.")
      }

      this.isJsonRpcProvider = true
    }

    if (typeof web3Provider !== "undefined" && web3Provider !== null) {
      this.isWeb3Provider = true
    }

    try {
      if (this.isJsonRpcProvider) {
        this.provider = new ethers.providers.JsonRpcProvider(jsonRpcProvider)
        if (!this.avoidPrivateKeySigner && signer?.privateKey) {
          try {
            this.signer = new ethers.Wallet(
              signer.privateKey,
              this.provider ?? undefined
            )
          } catch (error) {
            throw new Error("provide a valid private key for the signer.")
          }
        }
      } else if (this.isWeb3Provider && web3Provider) {
        if (!(web3Provider instanceof ethers.providers.Web3Provider))
          this.provider = new ethers.providers.Web3Provider(web3Provider)
        else this.provider = web3Provider
      }

      this.contractAddress = swap[network]
      this.contract = new ethers.Contract(
        this.contractAddress,
        contractAbi,
        this.provider ?? undefined
      )

      if (!this.isJsonRpcProvider || this.avoidPrivateKeySigner) return

      if (!this.signer) throw new Error("signer unset")
      this.contract = this.contract.connect(this.signer)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns the swap main details information.
   *
   * @param swapId - The identifier of the swap.
   */
  public async getSwapDetails(swapId: number) {
    try {
      if (!this.contract) throw new Error("contract unset")

      const {
        addressMaker,
        discountMaker,
        valueMaker,
        flatFeeMaker,
        addressTaker,
        discountTaker,
        valueTaker,
        flatFeeTaker,
        swapStart,
        swapEnd,
        flagFlatFee,
        flagRoyalties,
        status,
        royaltiesMaker,
        royaltiesTaker,
      } = await this.contract.getSwapIntentById(swapId)

      return {
        addressMaker,
        discountMaker,
        valueMaker,
        flatFeeMaker,
        addressTaker,
        discountTaker,
        valueTaker,
        flatFeeTaker,
        swapStart,
        swapEnd,
        flagFlatFee,
        flagRoyalties,
        status,
        royaltiesMaker,
        royaltiesTaker,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns the assets details involved in the swap.
   *
   * @param swapId - The identifier of the swap.
   */
  public async getSwapAssets(swapId: number) {
    try {
      if (!this.contract) throw new Error("contract unset")

      const swapStructMakerSize = await this.contract.getSwapStructSize(
        swapId,
        true
      )
      const swapStructTakerSize = await this.contract.getSwapStructSize(
        swapId,
        false
      )

      const assetsMaker = []
      const assetsTaker = []

      for (let i = 0; i < swapStructMakerSize; i++) {
        assetsMaker.push(await this.contract.getSwapStruct(swapId, true, i))
      }
      for (let i = 0; i < swapStructTakerSize; i++) {
        assetsTaker.push(await this.contract.getSwapStruct(swapId, false, i))
      }

      return {
        assetsMaker,
        assetsTaker,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns true if the ERC20 token is whitelisted by the smart contract.
   *
   * @param erc20Address - The ERC20 token address.
   */
  public async isERC20WhiteListed(erc20Address: string) {
    try {
      if (!this.contract) throw new Error("contract unset")

      return await this.contract.getERC20WhiteList(erc20Address)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns true if the ERC721/ERC1155 token is blacklisted by the smart contract.
   *
   * @param assetAddress - The ERC721/ERC1155 token address
   */
  public async isNFTBlacklisted(assetAddress: string) {
    try {
      if (!this.contract) throw new Error("contract unset")

      return await this.contract.getNFTBlacklist(assetAddress)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns the payment struct configuration of the smart contract.
   */
  public async getPayment() {
    try {
      if (!this.contract) throw new Error("contract unset")

      const { flagFlatFee, flagRoyalties, flatFee, bps, scalePercent } =
        await this.contract.payment()

      return { flagFlatFee, flagRoyalties, flatFee, bps, scalePercent }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  public async getReferenceAddress() {
    try {
      if (!this.contract) throw new Error("contract unset")

      const { ROYALTYENGINEADDRESS, TRADESQUAD, PARTNERSQUAD, VAULT } =
        await this.contract.referenceAddress()

      return { ROYALTYENGINEADDRESS, TRADESQUAD, PARTNERSQUAD, VAULT }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns the reference address struct configuration of the smart contract.
   */
  public async isBannedAddress(address: string) {
    try {
      if (!this.contract) throw new Error("contract unset")

      return await this.contract.bannedAddress(address)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns the instance of ethers used internally to this module.
   */
  public getEthersJSInstance() {
    return ethers
  }

  /**
   * Returns the instance of networks currently supported by this SDK.
   */
  public getNetworksAvailable() {
    return swap
  }

  /**
   * Returns the instance of royalty registries engines currently supported by this SDK.
   */
  public getRoyaltyRegistriesEngines() {
    return royaltyRegistriesEngines
  }

  /**
   * Returns the ABI of the royalty registriy engine currently supported by this SDK.
   */
  public getRoyaltyRegistryEngineABI() {
    return royaltyRegistryEngineAbi
  }
}
