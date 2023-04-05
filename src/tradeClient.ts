import { Seaport } from "@opensea/seaport-js"
import { ItemType } from "@opensea/seaport-js/lib/constants"
import { CreateOrderInput } from "@opensea/seaport-js/lib/types"
import { ethers } from "ethers"
import AssetsArray from "./assetsArray"
import contracts from "./lib/contracts"
import events from "./lib/events"
import GlobalFetch from "./lib/globalFetch"
import HTTPRequestInit from "./types/general/httpRequestInit"
import HTTPResponse from "./types/general/httpResponse"
import Maybe from "./types/general/maybe"
import Network from "./types/general/network"
import ApiKeyAuthorized from "./types/tradeClient/apiKeyAuthorized"
import CallbackParams from "./types/tradeClient/callbackParams"
import CreateSwapPeer from "./types/tradeClient/createSwapPeer"
import TradeClientEventsMap from "./types/tradeClient/eventsMap"
import Fee from "./types/tradeClient/fee"
import JWTAuthorized from "./types/tradeClient/jwtAuthorized"
import MultiSigWallet from "./types/tradeClient/multisigWallet"
import NFTTraderFees from "./types/tradeClient/nfttraderFees"
import PartialSwap from "./types/tradeClient/partialSwap"
import Swap from "./types/tradeClient/swap"
import { SwapDetail } from "./types/tradeClient/swapDetail"
import TradeClientJsonRpcInit from "./types/tradeClient/tradeClientJsonRpcInit"
import TradeClientWeb3Init from "./types/tradeClient/tradeClientWeb3Init"
import WithAddress from "./types/tradeClient/withAddress"
import GetFullListResponse from "./types/tradeClient/getGlobalSwapsListResponse"
import GetGlobalSwapsListResponse from "./types/tradeClient/getGlobalSwapsListResponse"
import GetUserSwapsListResponse from "./types/tradeClient/getUserSwapsListResponse"
import TradeClientConfig from "./types/tradeClient/tradeClientConfig"
import NFTList from "./types/tradeClient/nftList"

const {
  royaltyRegistriesEngines,
  seaportSmartContracts,
  royaltyRegistryEngineAbi,
} = contracts

export default class TradeClient extends GlobalFetch {
  private _isJsonRpcProvider = false
  private _isWeb3Provider = false
  private _provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
  private _seaport: Seaport
  private _eventsCollectorCallbacks = events.map(
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
  private _network: Network
  private _blocksNumberConfirmationRequired: number
  private _jwt: Maybe<string> = null
  private _apiKey: Maybe<string> = null
  private _BACKEND_URL: string = "https://api.nfttrader.io" //DO NOT EDIT THIS, use .config() instead
  private _TRADESQUAD_ADDRESS: string =
    "0xdbd4264248e2f814838702e0cb3015ac3a7157a1"
  private _MIN_BLOCKS_REQUIRED: number = 3

  /**
   * Create an instance of the NFTTrader TradeClient object.
   *
   * @param config - Configuration object for the sdk.
   */
  constructor(config: JWTAuthorized<TradeClientJsonRpcInit>)
  /**
   * Create an instance of the NFTTrader TradeClient object.
   *
   * @param config - Configuration object for the sdk.
   */
  constructor(config: JWTAuthorized<TradeClientWeb3Init>)
  /**
   * Create an instance of the NFTTrader TradeClient object.
   *
   * @param config - Configuration object for the sdk.
   */
  constructor(config: ApiKeyAuthorized<TradeClientJsonRpcInit>)
  /**
   * Create an instance of the NFTTrader TradeClient object.
   *
   * @param config - Configuration object for the sdk.
   */
  constructor(config: ApiKeyAuthorized<TradeClientWeb3Init>)
  constructor(
    config:
      | JWTAuthorized<TradeClientJsonRpcInit | TradeClientWeb3Init>
      | ApiKeyAuthorized<TradeClientJsonRpcInit | TradeClientWeb3Init>
  ) {
    super()
    if (
      ("web3Provider" in config && "jsonRpcProvider" in config) ||
      (!("web3Provider" in config) && !("jsonRpcProvider" in config))
    )
      throw new Error("You must provide only one provider at a time")

    if ("jsonRpcProvider" in config) {
      if (
        typeof config.jsonRpcProvider !== "string" ||
        !config.jsonRpcProvider.length
      )
        throw new Error(
          "jsonRpcProvider must be a string -> Eg. https://goerli.infura.io/v3/..."
        )

      this._isJsonRpcProvider = true
      this._provider = new ethers.providers.JsonRpcProvider(
        config.jsonRpcProvider
      )
    } else {
      if (
        typeof config.web3Provider !== "object" ||
        Array.isArray(config.web3Provider)
      )
        throw new Error("web3Provider must be an object -> Eg. window.ethereum")

      this._isWeb3Provider = true
      this._provider = !(
        config.web3Provider instanceof ethers.providers.Web3Provider
      )
        ? new ethers.providers.Web3Provider(config.web3Provider)
        : config.web3Provider
    }
    this._seaport = new Seaport(this._provider, { seaportVersion: "1.1" })

    const { network, blocksNumberConfirmationRequired } = config
    if (!network) throw new Error("network must be passed")
    if (!Object.keys(royaltyRegistriesEngines).includes(`${network}`))
      throw new Error("Invalid network")
    if (
      blocksNumberConfirmationRequired !== undefined &&
      blocksNumberConfirmationRequired !== null &&
      blocksNumberConfirmationRequired < 1
    )
      throw new Error(
        "blocksNumberConfirmationRequired cannot be lower than one."
      )

    this._network = network

    this._blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
      ? blocksNumberConfirmationRequired
      : this._MIN_BLOCKS_REQUIRED

    if (
      (!("jwt" in config) && !("apiKey" in config)) ||
      ("jwt" in config &&
        (typeof config.jwt !== "string" || !config.jwt.length)) ||
      ("apiKey" in config &&
        (typeof config.apiKey !== "string" || !config.apiKey.length))
    )
      throw new Error("At least apiKey or jwt must be provided")

    if ("jwt" in config) this._jwt = config.jwt
    else this._apiKey = config.apiKey
  }

  private _fetchWithAuth<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    }
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      authorization: `${this._jwt ? "Bearer" : "x-api-key"} ${
        this._jwt ?? this._apiKey
      }`,
    }

    if (this._jwt) options.headers["authorizer-type"] = "token"
    else if (this._apiKey) options.headers["authorizer-type"] = "request"

    return this._fetch(url, options)
  }

  /**
   * Append a callback function from the event queue. Used for intercepting the event during the creation/closing/canceling of the deal and for the changing of the taker.
   *
   * @param eventName - The name of the event.
   * @param callback - The callback function to execute once the event is fired.
   */
  public on<EventName extends keyof TradeClientEventsMap>(
    eventName: EventName,
    callback: TradeClientEventsMap[EventName]
  ) {
    const event = this._eventsCollectorCallbacks.find((eventItem) => {
      return eventItem.name === eventName
    })

    if (!event) throw new Error("event not supported.")

    event.callbacks.push(callback)
  }

  /**
   * Remove a callback function from the event queue.
   *
   * @param eventName - The name of the event.
   * @param callback - The callback function to execute once the event is fired.
   */
  public off<EventName extends keyof TradeClientEventsMap>(
    eventName: EventName,
    callback?: TradeClientEventsMap[EventName] | null
  ) {
    const event = this._eventsCollectorCallbacks.find((eventItem) => {
      return eventItem.name === eventName
    })

    if (!event) throw new Error("event not supported.")

    if (
      callback !== null &&
      typeof callback !== "function" &&
      typeof callback !== "undefined"
    )
      throw new Error("callback must be a Function.")

    if (callback) {
      const index = event.callbacks.findIndex((func) => {
        return func.toString() === callback.toString()
      })
      event.callbacks.splice(index, 1)
    } else {
      event.callbacks = []
    }
  }

  /**
   * Used to fire events internally. Used internally, no reason to interact with this method directly.
   *
   * @param eventName - The name of the event.
   * @param params - The params to give to the callback function.
   */
  private __emit<EventName extends keyof TradeClientEventsMap>(
    eventName: EventName,
    params?: CallbackParams<TradeClientEventsMap[EventName]>
  ) {
    const event = this._eventsCollectorCallbacks.find((eventItem) => {
      return eventItem.name === eventName
    })

    if (!event) throw new Error("event not found.")

    for (const cb of event.callbacks) {
      cb(params as any)
    }
  }

  /**
   * Set the block numbers to wait in which consider a transaction mined by the createSwap, cancelSwap, closeSwap and editTaker methods.
   *
   * @param blocksNumberConfirmationRequired - The number of the mined blocks to wait for considering a transaction valid.
   */
  public setBlocksNumberConfirmationRequired(
    blocksNumberConfirmationRequired: number
  ) {
    if (blocksNumberConfirmationRequired < 1)
      throw new Error(
        "blocksNumberConfirmationRequired cannot be lower than one."
      )

    this._blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
  }

  /**
   * Get a list of all seaport smart contracts address deployed
   */
  public getSeaportContractsAddresses(): Record<Network, string> {
    return seaportSmartContracts
  }

  /**
   * Get a list of all royalties engine smart contracts address deployed
   */
  public getRoyaltyRegistriesEngines(): Record<Network, string> {
    return royaltyRegistriesEngines
  }

  /**
   * Get the ABI of the royalty engine smart contract
   */
  public getRoyaltyRegistryEngineABI(): Array<any> {
    return royaltyRegistryEngineAbi
  }

  /**
   * Create the swap
   *
   * @param maker - The maker of the swap
   * @param taker - The taker (counterparty) of the swap
   * @param end - The number of the days representing the validity of the swap
   * @param fees - The array of fees to apply on the swap
   */
  public async createSwap(
    maker: CreateSwapPeer,
    taker: CreateSwapPeer<WithAddress>,
    end = 0,
    fees?: Array<Fee>,
    postId?: string
  ): Promise<Swap> {
    let ownTradeSquad: boolean = false
    if (end < 0) throw new Error("swapEnd cannot be lower than zero.")
    if ("assets" in maker && maker.assets && maker.assets.length > 0) {
      //seaport supports erc20 tokens in the offer array object but NFT Trader not,
      //so we throw an error if someone try to place tokens in the offer
      const token = maker.assets.find((asset) => {
        return asset.itemType === AssetsArray.TOKEN_CONSTANTS["ERC20"]
      })

      if (token)
        throw new Error("You cannot add an ERC20 token in the maker assets.")
    }

    // Retrieve the maker address
    const [addressMaker] = await this._provider.listAccounts()
    // Retrieve if the maker address own TradeSquad NFTs for remove the fee
    const response = await this._fetch<{ data: Array<NFTList> }>(
      `${this._BACKEND_URL}/metadata/getNftCollectionAssetsByOwner/1/${this._TRADESQUAD_ADDRESS}/${addressMaker}/50/null`
    )

    // Check if the user doesn't own any TradeSquad
    if (
      response &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data) &&
      response.data.data[0] &&
      `total` in response.data.data[0]
    ) {
      let total = response.data.data[0].total
      if (total > 0) ownTradeSquad = true
      else ownTradeSquad = false
    }

    const orderInit = await this._addNFTTraderFee(
      {
        offer: [...(maker.assets ?? [])].map(
          (a) =>
            ({
              ...a,
              itemType:
                typeof a.itemType === "string"
                  ? AssetsArray.TOKEN_CONSTANTS[a.itemType]
                  : a.itemType,
            } as { itemType: ItemType } & typeof a)
        ),
        consideration: [...(taker.assets ?? [])].map(
          (a) =>
            ({
              ...a,
              itemType:
                typeof a.itemType === "string"
                  ? AssetsArray.TOKEN_CONSTANTS[a.itemType]
                  : a.itemType,
              recipient: a.recipient ? a.recipient : addressMaker,
            } as { itemType: ItemType } & typeof a)
        ),
        zone: taker.address,
        endTime: Math.floor(
          new Date().setDate(new Date().getDate() + end) / 1000
        ).toString(), // days in seconds (UNIX timestamp)
        fees,
        restrictedByZone: true,
      },
      ownTradeSquad
    )

    const { executeAllActions } = await this._seaport.createOrder(
      orderInit,
      addressMaker
    )

    const order = await executeAllActions()
    const orderHash = this._seaport.getOrderHash(order.parameters)

    try {
      await this._fetchWithAuth(`${this._BACKEND_URL}/trade/insertTrade`, {
        method: "POST",
        body: {
          network: `${this._network}`,
          orderInit,
          order: {
            orderHash,
            orderType: order.parameters.orderType,
            ...order,
          },
          postId: postId ? postId.toString() : undefined,
        },
      })
    } catch (e) {
      console.warn(e)
    }

    return { hash: orderHash, ...order }
  }

  /**
   * Execute the swap and finalize the order
   *
   * @param swapId - The id of the swap
   */
  public async execSwap(swapId: string) {
    try {
      const response = await this._fetchWithAuth<{ data: Array<SwapDetail> }>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${swapId}`
      )

      if (!response.data)
        return this.__emit("execSwapError", {
          error: "response data is empty",
          typeError: "ApiError",
        })

      const data: SwapDetail = response.data.data[0]

      const parameters = data.parameters.order.parameters
      const taker = data.parameters.addressTaker
      const swap: PartialSwap = {
        hash: data.parameters.order.orderHash,
        parameters: parameters,
        signature: data.parameters.order.signature,
      }

      try {
        const { executeAllActions } = await this._seaport.fulfillOrder({
          order: swap,
          accountAddress: taker,
        })
        this.__emit("execSwapTransactionCreated")

        const transact = await executeAllActions()
        try {
          const receipt = await transact.wait(
            this._blocksNumberConfirmationRequired
          )
          this.__emit("execSwapTransactionMined", { receipt })
        } catch (error) {
          return this.__emit("execSwapTransactionError", {
            error,
            typeError: "waitError",
          })
        }
      } catch (error) {
        this.__emit("execSwapTransactionError", {
          error,
          typeError: "execSwapTransactionError",
        })
      }
    } catch (error) {
      this.__emit("execSwapError", {
        error,
        typeError: "ApiError",
      })
    }
  }

  /**
   * Cancel the swap specified
   *
   * @param swapId - The id of the swap
   * @param gasLimit - the gas limit of the transaction
   * @param gasPrice - the gas price of the transaction
   */
  public async cancelSwap(
    swapId: string,
    gasLimit: number = 2000000,
    gasPrice: Maybe<string> = null
  ) {
    try {
      const response = await this._fetchWithAuth<{ data: Array<SwapDetail> }>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${swapId}`
      )

      if (!response.data)
        return this.__emit("cancelSwapError", {
          error: "response data is empty",
          typeError: "ApiError",
        })

      const data: SwapDetail = response.data.data[0]
      const parameters = data.parameters.order.parameters
      const maker = data.parameters.addressMaker
      const txOverrides: { gasLimit?: number; gasPrice?: string } = {}

      if (gasLimit && gasLimit !== 2000000) txOverrides.gasLimit = gasLimit
      if (gasPrice) txOverrides.gasPrice = gasPrice

      try {
        const tx = this._seaport.cancelOrders([parameters], maker)
        this.__emit("cancelSwapTransactionCreated", { tx })
        const transact = await tx.transact({ ...txOverrides })

        try {
          const receipt = await transact.wait(
            this._blocksNumberConfirmationRequired
          )

          this.__emit("cancelSwapTransactionMined", { receipt })
        } catch (error) {
          return this.__emit("cancelSwapTransactionError", {
            error,
            typeError: "waitError",
          })
        }
      } catch (error) {
        return this.__emit("cancelSwapTransactionError", {
          error,
          typeError: "cancelSwapTransactionError",
        })
      }
    } catch (error) {
      this.__emit("cancelSwapError", {
        error,
        typeError: "ApiError",
      })
    }
  }

  /**
   * Get the order specified by the swapId provided as a paramater
   *
   * @param swapId
   * @returns promiseOrder
   */
  public async getSwapOrder(swapId: string): Promise<Maybe<SwapDetail>> {
    try {
      const response = await this._fetchWithAuth<{ data: Array<SwapDetail> }>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${swapId}`
      )
      if (response.data) return response.data.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Get the global swaps list
   *
   * @param networkId
   * @param status
   * @param skip
   * @param take
   * @param from
   * @param to
   * @param searchAddress
   * @returns
   */
  public async getGlobalSwapsList(
    networkId: string,
    status: number,
    skip: number,
    take: number,
    from?: number | "null",
    to?: number | "null",
    searchAddress?: string
  ): Promise<GetGlobalSwapsListResponse> {
    try {
      const tradeList = (
        await this._fetchWithAuth<{ data: Array<GetFullListResponse> }>(
          `${
            this._BACKEND_URL
          }/tradelist/getFullList/${networkId}/${status}/${skip}/${take}${
            from !== undefined &&
            from !== null &&
            to !== undefined &&
            to !== null
              ? `/${from}/${to}`
              : ""
          }${
            from !== undefined &&
            from !== null &&
            to !== undefined &&
            to !== null &&
            searchAddress !== undefined &&
            searchAddress !== null
              ? `/${searchAddress}`
              : ""
          }`
        )
      ).data?.data?.[0]

      if (!tradeList) throw new Error("Internal server error")

      return tradeList
    } catch (e) {
      console.warn(e)
      throw e
    }
  }

  /**
   * Get the user swaps list
   *
   * @param networkId
   * @param address
   * @param status
   * @param skip
   * @param take
   * @param from
   * @param to
   * @param searchAddress
   * @returns
   */
  public async getUserSwapsList(
    networkId: string,
    address: string,
    status: number,
    skip: number,
    take: number,
    from?: number | "null",
    to?: number | "null",
    searchAddress?: string
  ): Promise<GetUserSwapsListResponse> {
    try {
      const swapList = (
        await this._fetchWithAuth<{ data: Array<GetUserSwapsListResponse> }>(
          `${
            this._BACKEND_URL
          }/tradelist/getSwapList/${networkId}/${address}/${status}/${skip}/${take}${
            from !== undefined &&
            from !== null &&
            to !== undefined &&
            to !== null
              ? `/${from}/${to}`
              : ""
          }${
            from !== undefined &&
            from !== null &&
            to !== undefined &&
            to !== null &&
            searchAddress !== undefined &&
            searchAddress !== null
              ? `/${searchAddress}`
              : ""
          }`
        )
      ).data?.data?.[0]

      if (!swapList) throw new Error("Internal server error")

      return swapList
    } catch (e) {
      console.warn(e)
      throw e
    }
  }

  /**
   * Override the basic configurations of this client
   *
   * @param config
   */
  public config(config: TradeClientConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
    if (config.minBlocksRequired)
      this._MIN_BLOCKS_REQUIRED = config.minBlocksRequired
  }

  private async _getNFTTraderGnosis(): Promise<Maybe<MultiSigWallet>> {
    try {
      const response = await this._fetchWithAuth<MultiSigWallet>(
        `${this._BACKEND_URL}/wallet/multisigWallet/${this._network}`
      )

      if (response.data) return response.data

      console.warn("no data field in response")
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  private async _getNFTTraderFees(): Promise<Maybe<NFTTraderFees>> {
    try {
      const response = await this._fetchWithAuth<NFTTraderFees>(
        `${this._BACKEND_URL}/fee/nftTraderFee/${this._network}`
      )

      if (response.data) return response.data

      console.warn("no data field in response")
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  private _analyzeOrder(orderInit: CreateOrderInput) {
    if (!orderInit || orderInit.constructor.name !== "Object")
      throw new Error("Invalid argument")

    const offer = {
        hasNFT: false,
        hasToken: false,
        NFTs: 0,
        NFTcollections: [] as Array<string>,
        NFTcollectionsIdentifiers: {} as Record<string, Array<string>>,
      },
      consideration = { ...offer }

    if (
      "offer" in orderInit &&
      Array.isArray(orderInit.offer) &&
      orderInit.offer.length
    )
      for (const o of orderInit.offer.filter(
        (rawOffer) =>
          rawOffer?.itemType !== undefined && rawOffer.itemType !== null
      ))
        switch (o.itemType) {
          case ItemType.ERC1155:
          case ItemType.ERC721:
            offer.hasNFT = true
            offer.NFTs++

            if (!offer.NFTcollections.includes(o.token))
              offer.NFTcollections.push(o.token)

            offer.NFTcollectionsIdentifiers[o.token] = [
              ...(offer.NFTcollectionsIdentifiers[o.token] ?? []),
              o.identifier,
            ]

            break
          case ItemType.ERC20:
            offer.hasToken = true
        }

    if (
      "consideration" in orderInit &&
      Array.isArray(orderInit.consideration) &&
      orderInit.consideration.length
    )
      for (const c of orderInit.consideration)
        if ("itemType" in c)
          switch (c.itemType) {
            case ItemType.ERC1155:
            case ItemType.ERC721:
              consideration.hasNFT = true
              consideration.NFTs++

              if (!consideration.NFTcollections.includes(c.token))
                consideration.NFTcollections.push(c.token)

              consideration.NFTcollectionsIdentifiers[c.token] = [
                ...(consideration.NFTcollectionsIdentifiers[c.token] ?? []),
                c.identifier,
              ]

              break
            case ItemType.ERC20:
              consideration.hasToken = true
              break
            case ItemType.NATIVE:
              consideration.hasToken = true
          }
        else consideration.hasToken = true

    return {
      offer,
      consideration,
    }
  }

  private async _addNFTTraderFee(
    orderInit: CreateOrderInput,
    ownTradeSquad = false
  ): Promise<CreateOrderInput> {
    const orderTypes = this._analyzeOrder(orderInit)
    const nftTraderFees: Maybe<NFTTraderFees> = await this._getNFTTraderFees()
    const nftTraderGnosis: Maybe<MultiSigWallet> =
      await this._getNFTTraderGnosis()

    let flatFee: string | undefined
    let basisPoints: number | undefined
    let gnosisRecipient = ""

    // If TradeSquad is not in the wallet, fee applied
    if (!ownTradeSquad) {
      if (nftTraderFees) {
        flatFee = nftTraderFees.flatFee[0].fee
        basisPoints = nftTraderFees.percentageFee[0].basisPoints
      } else {
        flatFee = "0"
        basisPoints = 50
      }
    } else {
      // If TradeSquad is in the wallet, fee resetted
      flatFee = "0"
      basisPoints = 0
    }

    if (nftTraderGnosis)
      gnosisRecipient = nftTraderGnosis.multisig[0].multisigAddress

    if (
      this._network &&
      orderTypes.consideration.hasNFT &&
      !orderTypes.consideration.hasToken &&
      orderTypes.offer.hasNFT &&
      !orderTypes.offer.hasToken
    ) {
      return {
        ...orderInit,
        offer: orderInit.offer,
        consideration: [
          ...orderInit.consideration,
          {
            recipient: gnosisRecipient,
            itemType: AssetsArray.TOKEN_CONSTANTS.NATIVE as any,
            token: ethers.constants.AddressZero,
            amount: ethers.utils.parseEther(flatFee).toString(),
            identifier: "0",
          },
        ],
      }
    }

    if (
      this._network &&
      orderTypes.consideration.hasToken &&
      orderTypes.offer.hasNFT &&
      orderTypes.offer.NFTcollections.length > 0
    ) {
      if (
        !("fees" in orderInit) ||
        typeof orderInit === "undefined" ||
        (Array.isArray(orderInit.fees) && orderInit.fees.length === 0)
      )
        orderInit.fees = [
          {
            recipient: gnosisRecipient,
            basisPoints,
          },
        ]
      else if (Array.isArray(orderInit.fees) && orderInit.fees.length > 0) {
        orderInit.fees.push({
          recipient: gnosisRecipient,
          basisPoints,
        })
      }
    }
    return orderInit
  }
}
