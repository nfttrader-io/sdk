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

  public async createSwap() {
    const discountMaker = false
    const valueMaker = ethers.BigNumber.from(ethMaker)
    const flatFeeMaker = 0
    const addressTaker = taker
    const discountTaker = false
    const valueTaker = ethers.BigNumber.from(ethTaker)
    const flatFeeTaker = 0
    const swapStart = 0
    const flagFlatFee = false
    const flagRoyalties = false
    const status = 0
    const royaltiesMaker = 0
    const royaltiesTaker = 0
    const swapIntent = [
      addressMaker,
      discountMaker,
      valueMaker.toString(),
      flatFeeMaker,
      addressTaker,
      discountTaker,
      valueTaker.toString(),
      flatFeeTaker,
      swapStart,
      swapEnd,
      flagFlatFee,
      flagRoyalties,
      status,
      royaltiesMaker,
      royaltiesTaker,
    ]

    let hasSquad = false
    let fee

    try {
      const { flatFee } = await this.getPayment()
      fee = flatFee

      const { TRADESQUAD, PARTNERSQUAD } = await this.getReferenceAddress()

      const contractTradeSquad = new ethers.Contract(
        TRADESQUAD,
        erc721Abi,
        this.provider ?? undefined
      )
      const contractPartnerSquad = new ethers.Contract(
        PARTNERSQUAD,
        erc721Abi,
        this.provider ?? undefined
      )

      const balanceTradeSquad = await contractTradeSquad.balanceOf(addressMaker)
      const balancePartnerSquad = await contractPartnerSquad.balanceOf(
        addressMaker
      )

      if (balanceTradeSquad.gt(0) || balancePartnerSquad.gt(0)) hasSquad = true
    } catch (error: any) {
      throw new Error(error)
    }

    const txOverrides = {
      value: hasSquad ? valueMaker.toString() : valueMaker.add(fee).toString(),
      gasLimit: gasLimit ?? undefined,
      gasPrice: gasPrice ?? undefined,
    }

    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
      signerTx = this.provider?.getSigner(addressMaker)
      contract = signerTx ? this.contract?.connect(signerTx) ?? null : null
    }

    try {
      const tx: ethers.providers.TransactionResponse =
        await contract?.createSwapIntent(
          swapIntent,
          assetsMaker,
          assetsTaker,
          referralAddress,
          { ...txOverrides }
        )

      // this.__emit("createSwapTransactionCreated", { tx })
      try {
        const receipt = await tx.wait(this.blocksNumberConfirmationRequired)
        // this.__emit("createSwapTransactionMined", { receipt })
      } catch (error) {
        // this.__emit("createSwapTransactionError", {
        //   error,
        //   typeError: "waitError",
        // })
      }
    } catch (error) {
      // this.__emit("createSwapTransactionError", {
      //   error,
      //   typeError: "createSwapIntentError",
      // })
    }
  }

  /**
   * Close the swap. Only the taker (counterparty) can close it if its address is specified. Otherwise everyone can close the swap.
   *
   * @param closeSwapObj - The closeSwap configuration object.
   * @param gasLimit - The gas limit of the transaction.
   * @param gasPrice - The gas price of the transaction.
   */
  public async closeSwap(
    {
      swapId,
      referralAddress = "0x0000000000000000000000000000000000000000",
    }: {
      /**
       * The identifier of the swap.
       */
      swapId: number
      /**
       * The referral address of the transaction.
       */
      referralAddress?: string
    },
    gasLimit = 2000000,
    gasPrice?: string | null
  ) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
      throw new Error(
        "you cannot close a swap when you're in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction."
      )

    try {
      let hasSquad = false
      const { flatFee: fee } = await this.getPayment()
      const taker = this.isJsonRpcProvider
        ? this.signer?.address ?? null
        : this.provider
        ? (await this.provider.listAccounts())[0]
        : null
      if (!taker) throw new Error("taker not defined. check signer address.")
      const { valueTaker } = await this.getSwapDetails(swapId)
      const { TRADESQUAD, PARTNERSQUAD } = await this.getReferenceAddress()
      const contractTradeSquad = new ethers.Contract(
        TRADESQUAD,
        erc721Abi,
        this.provider ?? undefined
      )
      const contractPartnerSquad = new ethers.Contract(
        PARTNERSQUAD,
        erc721Abi,
        this.provider ?? undefined
      )

      const balanceTradeSquad = await contractTradeSquad.balanceOf(taker)
      const balancePartnerSquad = await contractPartnerSquad.balanceOf(taker)

      if (balanceTradeSquad.gt(0) || balancePartnerSquad.gt(0)) hasSquad = true

      const txOverrides = {
        value: hasSquad
          ? valueTaker.toString()
          : valueTaker.add(fee).toString(),
        gasLimit: gasLimit ?? undefined,
        gasPrice: gasPrice ?? undefined,
      }

      let senderTx
      let signerTx
      let contract = this.contract

      if (this.isWeb3Provider) {
        senderTx = this.provider
          ? (await this.provider.listAccounts())[0]
          : null
        signerTx =
          this.provider && senderTx ? this.provider.getSigner(senderTx) : null
        contract =
          this.contract && signerTx ? this.contract.connect(signerTx) : null
      }

      try {
        const tx: ethers.providers.TransactionResponse =
          await contract?.closeSwapIntent(swapId, referralAddress, {
            ...txOverrides,
          })
        this.__emit("closeSwapTransactionCreated", { tx })
        try {
          const receipt = await tx.wait(this.blocksNumberConfirmationRequired)
          this.__emit("closeSwapTransactionMined", { receipt })
        } catch (error) {
          this.__emit("closeSwapTransactionError", {
            error,
            typeError: "waitError",
          })
        }
      } catch (error) {
        this.__emit("closeSwapTransactionError", {
          error,
          typeError: "closeSwapIntentError",
        })
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Returns the gas estimation cost of the close swap operation.
   *
   * @param closeSwapObj - The closeSwap configuration object.
   * @param gasLimit - The gas limit of the transaction.
   * @param gasPrice - The gas price of the transaction.
   */
  public async estimateGasCloseSwap(
    {
      swapId,
      referralAddress = "0x0000000000000000000000000000000000000000",
    }: {
      /**
       * The identifier of the swap.
       */
      swapId: number
      /**
       * The referral address of the transaction.
       */
      referralAddress?: string
    },
    gasLimit = 2000000,
    gasPrice?: string | null
  ) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
      throw new Error(
        "you cannot close a swap when you're in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction."
      )

    try {
      let hasSquad = false
      const { flatFee: fee } = await this.getPayment()
      const taker = this.isJsonRpcProvider
        ? this.signer?.address ?? null
        : this.provider
        ? (await this.provider.listAccounts())[0]
        : null
      if (!taker) throw new Error("taker not defined. check signer address.")
      const { valueTaker } = await this.getSwapDetails(swapId)
      const { TRADESQUAD, PARTNERSQUAD } = await this.getReferenceAddress()
      const contractTradeSquad = new ethers.Contract(
        TRADESQUAD,
        erc721Abi,
        this.provider ?? undefined
      )
      const contractPartnerSquad = new ethers.Contract(
        PARTNERSQUAD,
        erc721Abi,
        this.provider ?? undefined
      )

      const balanceTradeSquad = await contractTradeSquad.balanceOf(taker)
      const balancePartnerSquad = await contractPartnerSquad.balanceOf(taker)

      if (balanceTradeSquad.gt(0) || balancePartnerSquad.gt(0)) hasSquad = true

      const txOverrides = {
        value: hasSquad
          ? valueTaker.toString()
          : valueTaker.add(fee).toString(),
        gasLimit: gasLimit ?? undefined,
        gasPrice: gasPrice ?? undefined,
      }

      let senderTx
      let signerTx
      let contract = this.contract

      if (this.isWeb3Provider) {
        senderTx = this.provider
          ? (await this.provider.listAccounts())[0]
          : null
        signerTx =
          this.provider && senderTx ? this.provider.getSigner(senderTx) : null
        contract =
          this.contract && signerTx ? this.contract.connect(signerTx) : null
      }

      try {
        const estimateGas = await contract?.estimateGas.closeSwapIntent(
          swapId,
          referralAddress,
          {
            ...txOverrides,
          }
        )
        return estimateGas
      } catch (error) {
        console.error(error)
        return null
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Cancel the swap. Only the maker (creator) can cancel it.
   *
   * @param swapId - The identifier of the swap.
   * @param gasLimit - The gas limit of the transaction.
   * @param gasPrice - The gas price of the transaction.
   */
  public async cancelSwap(
    swapId: number,
    gasLimit = 2000000,
    gasPrice?: string | null
  ) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
      throw new Error(
        "you cannot cancel a swap when you're in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction."
      )

    const txOverrides = {
      gasLimit: gasLimit ?? undefined,
      gasPrice: gasPrice ?? undefined,
    }

    let senderTx
    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
      senderTx = this.provider ? (await this.provider.listAccounts())[0] : null
      signerTx =
        this.provider && senderTx ? this.provider.getSigner(senderTx) : null
      contract =
        this.contract && signerTx ? this.contract.connect(signerTx) : null
    }

    try {
      const tx: ethers.providers.TransactionResponse =
        await contract?.cancelSwapIntent(swapId, { ...txOverrides })
      this.__emit("cancelSwapTransactionCreated", { tx })
      try {
        const receipt = await tx.wait(this.blocksNumberConfirmationRequired)
        this.__emit("cancelSwapTransactionMined", { receipt })
      } catch (error) {
        this.__emit("cancelSwapTransactionError", {
          error,
          typeError: "waitError",
        })
      }
    } catch (error) {
      this.__emit("cancelSwapTransactionError", {
        error,
        typeError: "cancelSwapIntentError",
      })
    }
  }

  /**
   * Returns the estimation gas cost of the cancel swap operation.
   *
   * @param swapId - The identifier of the swap.
   * @param gasLimit - The gas limit of the transaction.
   * @param gasPrice - The gas price of the transaction.
   */
  public async estimateGasCancelSwap(
    swapId: number,
    gasLimit = 2000000,
    gasPrice?: string | null
  ) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
      throw new Error(
        "you cannot cancel a swap when you're in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction."
      )

    const txOverrides = {
      gasLimit: gasLimit ?? undefined,
      gasPrice: gasPrice ?? undefined,
    }

    let senderTx
    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
      senderTx = this.provider ? (await this.provider.listAccounts())[0] : null
      signerTx =
        this.provider && senderTx ? this.provider.getSigner(senderTx) : null
      contract =
        this.contract && signerTx ? this.contract.connect(signerTx) : null
    }

    try {
      const estimateGas = await contract?.estimateGas.cancelSwapIntent(swapId, {
        ...txOverrides,
      })

      return estimateGas
    } catch (error) {
      console.error(error)
      return null
    }
  }

  /**
   * Edit the taker (counterparty) of the swap. Only the maker (creator) can edit it.
   *
   * @param swapId - The identifier of the swap.
   * @param addressTaker - The address of the taker (counterparty).
   * @param gasLimit - The gas limit of the transaction.
   * @param gasPrice - The gas price of the transaction.
   */
  // public async editTaker(
  //   swapId: number,
  //   addressTaker: string,
  //   gasLimit = 2000000,
  //   gasPrice?: string | null
  // ) {
  //   if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
  //     throw new Error(
  //       "you cannot edit the taker of a swap when you're in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction."
  //     )

  //   const txOverrides = {
  //     gasLimit: gasLimit ?? undefined,
  //     gasPrice: gasPrice ?? undefined,
  //   }

  //   let senderTx
  //   let signerTx
  //   let contract = this.contract

  //   if (this.isWeb3Provider) {
  //     senderTx = this.provider ? (await this.provider.listAccounts())[0] : null
  //     signerTx =
  //       this.provider && senderTx ? this.provider.getSigner(senderTx) : null
  //     contract =
  //       this.contract && signerTx ? this.contract.connect(signerTx) : null
  //   }

  //   try {
  //     const tx: ethers.providers.TransactionResponse =
  //       await contract?.editCounterPart(swapId, addressTaker, {
  //         ...txOverrides,
  //       })
  //     this.__emit("editTakerTransactionCreated", { tx })
  //     try {
  //       const receipt = await tx.wait(this.blocksNumberConfirmationRequired)
  //       this.__emit("editTakerTransactionMined", { receipt })
  //     } catch (error) {
  //       this.__emit("editTakerTransactionError", {
  //         error,
  //         typeError: "waitError",
  //       })
  //     }
  //   } catch (error) {
  //     this.__emit("editTakerTransactionError", {
  //       error,
  //       typeError: "editCounterpartError",
  //     })
  //   }
  // }

  /**
   * Returns the estimation gas cost of the edit counterparty operation.
   *
   * @param swapId - The identifier of the swap.
   * @param addressTaker - The address of the taker (counterparty).
   * @param gasLimit - The gas limit of the transaction.
   * @param gasPrice - The gas price of the transaction.
   */
  public async estimateGasEditTaker(
    swapId: number,
    addressTaker: string,
    gasLimit = 2000000,
    gasPrice?: string | null
  ) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
      throw new Error(
        "you cannot edit the taker of a swap when you're in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction."
      )

    const txOverrides = {
      gasLimit: gasLimit ?? undefined,
      gasPrice: gasPrice ?? undefined,
    }

    let senderTx
    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
      senderTx = this.provider ? (await this.provider.listAccounts())[0] : null
      signerTx =
        this.provider && senderTx ? this.provider.getSigner(senderTx) : null
      contract =
        this.contract && signerTx ? this.contract.connect(signerTx) : null
    }

    try {
      const estimateGas = await contract?.estimateGas.editCounterPart(
        swapId,
        addressTaker,
        {
          ...txOverrides,
        }
      )

      return estimateGas
    } catch (error) {
      console.error(error)
      return null
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
