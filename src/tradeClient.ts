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
import CreateTradePeer from "./types/tradeClient/createTradePeer"
import TradeClientEventsMap from "./types/tradeClient/eventsMap"
import Fee from "./types/tradeClient/fee"
import MultiSigWallet from "./types/tradeClient/multisigWallet"
import NFTTraderFees from "./types/tradeClient/nfttraderFees"
import Trade from "./types/tradeClient/trade"
import { TradeDetail } from "./types/tradeClient/tradeDetail"
import TradeClientJsonRpcInit from "./types/tradeClient/tradeClientJsonRpcInit"
import TradeClientWeb3Init from "./types/tradeClient/tradeClientWeb3Init"
import WithAddress from "./types/tradeClient/withAddress"
import GetFullListResponse from "./types/tradeClient/getGlobalTradesListResponse"
import GetGlobalTradesListResponse from "./types/tradeClient/getGlobalTradesListResponse"
import GetUserTradesListResponse from "./types/tradeClient/getUserTradesListResponse"
import TradeClientConfig from "./types/tradeClient/tradeClientConfig"
import PartialTrade from "./types/tradeClient/partialTrade"
import TradeClientDefaultInit from "./types/tradeClient/tradeClientDefaultInit"

const {
  royaltyRegistriesEngines,
  seaportSmartContracts,
  royaltyRegistryEngineAbi,
} = contracts

export default class TradeClient extends GlobalFetch {
  private _isJsonRpcProvider = false
  private _isWeb3Provider = false
  private _provider: Maybe<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  > = null
  private _seaport: Maybe<Seaport> = null
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

  private _network: Maybe<Network> = null
  private _blocksNumberConfirmationRequired: number
  private _apiKey: Maybe<string> = null
  private _BACKEND_URL: string = "https://api.nfttrader.io" //DO NOT EDIT THIS, use .config() instead
  private _MIN_BLOCKS_REQUIRED: number = 3

  constructor(config: ApiKeyAuthorized<TradeClientDefaultInit>) {
    super()

    const { blocksNumberConfirmationRequired } = config

    if (
      blocksNumberConfirmationRequired !== undefined &&
      blocksNumberConfirmationRequired !== null &&
      blocksNumberConfirmationRequired < 1
    )
      throw new Error(
        "blocksNumberConfirmationRequired cannot be lower than one."
      )

    this._blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
      ? blocksNumberConfirmationRequired
      : this._MIN_BLOCKS_REQUIRED

    if (
      !("apiKey" in config) ||
      ("apiKey" in config &&
        (typeof config.apiKey !== "string" || !config.apiKey.length))
    )
      throw new Error("an API key must be provided.")

    this._apiKey = config.apiKey
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
      "x-api-key": `${this._apiKey}`,
    }

    return this._fetch(url, options)
  }

  public initClient(config: TradeClientJsonRpcInit | TradeClientWeb3Init) {
    if (
      ("web3Provider" in config && "jsonRpcProvider" in config) ||
      (!("web3Provider" in config) && !("jsonRpcProvider" in config))
    )
      throw new Error("You must provide only one provider at a time.")

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

    this._seaport = new Seaport(this._provider, { seaportVersion: "1.5" })
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
   * Set the network id the client will query on.
   *
   * @param networkId - The name of the event.
   */
  public setNetworkId(networkId: string) {
    if (!networkId) throw new Error("network must be provided.")
    if (!Object.keys(royaltyRegistriesEngines).includes(`${networkId}`))
      throw new Error("Invalid network")

    this._network = networkId as Network
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
   * Set the block numbers to wait in which consider a transaction mined by the createTrade, cancelTrade and execTrade methods.
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
   * Create the trade
   *
   * @param maker - The maker of the trade
   * @param taker - The taker (counterparty) of the trade
   * @param end - The number of the days representing the validity of the trade
   * @param signature - The wallet signature of the creator
   * @param fees - The array of fees to apply on the trade
   * @param post - The post object containing the information related to the post and the reply accepted
   * @param post.postId - The post id related to this trade
   * @param post.replyId - The reply id related to the offer accepted to initialize the trade
   */
  public async createTrade(
    maker: CreateTradePeer<WithAddress>,
    taker: CreateTradePeer<WithAddress>,
    end = 0,
    signature: string,
    fees?: Array<Fee>,
    post?: {
      postId: string
      replyId: string
    }
  ): Promise<Trade> {
    if (!this._provider || !this._seaport)
      throw new Error("initClient() must be called to initialize the client.")
    if (!this._network) throw new Error("network must be defined.")
    if (end < 0) throw new Error("end cannot be lower than zero.")
    if ("assets" in maker && maker.assets && maker.assets.length > 0) {
      //seaport supports erc20 tokens in the offer array object but NFT Trader not,
      //so we throw an error if someone try to place tokens in the offer
      const erc20 = maker.assets.find((asset) => {
        return asset.itemType === AssetsArray.TOKEN_CONSTANTS["ERC20"]
      })

      if (erc20)
        throw new Error("You cannot add an ERC20 token in the maker assets.")

      const token = maker.assets.find((asset) => {
        return asset.itemType === AssetsArray.TOKEN_CONSTANTS["NATIVE"]
      })

      if (token)
        throw new Error("You cannot add NATIVE token in the maker assets.")
    }

    // Retrieve the maker address
    const [addressMaker] = await this._provider.listAccounts()

    const orderInit = await this._addNFTTraderFee({
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
    })

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
          postId: post && post.postId ? post.postId.toString() : undefined,
          replyId: post && post.replyId ? post.replyId.toString() : undefined,
          creatorAddress: maker.address,
        },
        headers: {
          "nfttrader-signed-message": signature,
        },
      })
    } catch (e) {
      console.warn(e)
    }

    return { hash: orderHash, ...order }
  }

  /**
   * Execute the trade and finalize the order
   *
   * @param tradeId - The id of the trade
   */
  public async execTrade(tradeId: string) {
    if (!this._seaport)
      throw new Error("initClient() must be called to initialize the client.")
    if (!this._network) throw new Error("network must be defined.")
    try {
      const response = await this._fetchWithAuth<{ data: Array<TradeDetail> }>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${tradeId}`
      )

      if (!response.data)
        return this.__emit("execTradeError", {
          error: "response data is empty",
          typeError: "ApiError",
        })

      const data: TradeDetail = response.data.data[0]

      const parameters = data.parameters.order.parameters
      const taker = data.parameters.addressTaker
      const trade: PartialTrade = {
        hash: data.parameters.order.orderHash,
        parameters: parameters,
        signature: data.parameters.order.signature,
      }

      try {
        const { executeAllActions } = await this._seaport.fulfillOrder({
          order: trade,
          accountAddress: taker,
        })
        this.__emit("execTradeTransactionCreated")

        const transact = await executeAllActions()
        try {
          const receipt = await transact.wait(
            this._blocksNumberConfirmationRequired
          )
          this.__emit("execTradeTransactionMined", { receipt })
        } catch (error) {
          return this.__emit("execTradeTransactionError", {
            error,
            typeError: "waitError",
          })
        }
      } catch (error) {
        this.__emit("execTradeTransactionError", {
          error,
          typeError: "execTradeTransactionError",
        })
      }
    } catch (error) {
      this.__emit("execTradeError", {
        error,
        typeError: "ApiError",
      })
    }
  }

  /**
   * Cancel the trade specified
   *
   * @param tradeId - The id of the trade
   * @param gasLimit - the gas limit of the transaction
   * @param gasPrice - the gas price of the transaction
   */
  public async cancelTrade(
    tradeId: string,
    gasLimit: number = 2000000,
    gasPrice: Maybe<string> = null
  ) {
    if (!this._seaport)
      throw new Error("initClient() must be called to initialize the client.")
    if (this._network) throw new Error("network must be defined.")
    try {
      const response = await this._fetchWithAuth<{ data: Array<TradeDetail> }>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${tradeId}`
      )

      if (!response.data)
        return this.__emit("cancelTradeError", {
          error: "response data is empty",
          typeError: "ApiError",
        })

      const data: TradeDetail = response.data.data[0]
      const parameters = data.parameters.order.parameters
      const maker = data.parameters.addressMaker
      const txOverrides: { gasLimit?: number; gasPrice?: string } = {}

      if (gasLimit && gasLimit !== 2000000) txOverrides.gasLimit = gasLimit
      if (gasPrice) txOverrides.gasPrice = gasPrice

      try {
        const tx = this._seaport.cancelOrders([parameters], maker)
        this.__emit("cancelTradeTransactionCreated", { tx })
        const transact = await tx.transact({ ...txOverrides })

        try {
          const receipt = await transact.wait(
            this._blocksNumberConfirmationRequired
          )

          this.__emit("cancelTradeTransactionMined", { receipt })
        } catch (error) {
          return this.__emit("cancelTradeTransactionError", {
            error,
            typeError: "waitError",
          })
        }
      } catch (error) {
        return this.__emit("cancelTradeTransactionError", {
          error,
          typeError: "cancelTradeTransactionError",
        })
      }
    } catch (error) {
      this.__emit("cancelTradeError", {
        error,
        typeError: "ApiError",
      })
    }
  }

  /**
   * Get the order specified by the tradeId provided as a parameter
   * @param networkId - the network id of the trade
   * @param tradeId - the identifier of the trade
   */
  public async getTradeOrder(
    networkId: string,
    tradeId: string
  ): Promise<Maybe<TradeDetail>> {
    try {
      const response = await this._fetchWithAuth<{ data: Array<TradeDetail> }>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${networkId}/${tradeId}`
      )
      if (response.data) return response.data.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Get the global trades list
   *
   * @param networkId
   * @param status
   * @param skip
   * @param take
   * @param from
   * @param to
   * @param collections
   * @param search
   * @param order
   * @returns
   */
  public async getGlobalTradesList({
    networkId,
    status,
    skip,
    take,
    from,
    to,
    collections,
    search,
    order,
  }: {
    networkId: Network | "*"
    status: string | "*"
    skip: number
    take: number
    from?: string | "null"
    to?: string | "null"
    collections?: Array<{ address: string; networkId: Network }>
    search?: Array<string>
    order?: {
      direction: "ASC" | "DESC"
      field: string
    }
  }): Promise<GetGlobalTradesListResponse> {
    try {
      const tradesList = (
        await this._fetchWithAuth<{ data: Array<GetFullListResponse> }>(
          `${this._BACKEND_URL}/tradelist/getFullList/${networkId}/${status}/${skip}/${take}`,
          {
            method: "POST",
            body: {
              collections:
                typeof collections !== "undefined" ? collections : [],
              search: typeof search !== "undefined" ? search : [],
              order: typeof order !== "undefined" ? order : null,
              from: typeof from !== "undefined" && from !== null ? from : null,
              to: typeof to !== "undefined" && to !== null ? to : null,
            },
          }
        )
      ).data?.data?.[0]

      if (!tradesList) throw new Error("Internal server error")

      return tradesList
    } catch (e) {
      console.warn(e)
      throw e
    }
  }

  /**
   * Get the user trades list
   *
   * @param networkId
   * @param address
   * @param status
   * @param skip
   * @param take
   * @param from
   * @param to
   * @param collections
   * @param searchAddress
   * @param order
   * @returns
   */
  public async getUserTradesList({
    networkId,
    address,
    status,
    skip,
    take,
    from,
    to,
    collections,
    searchAddress,
    order,
  }: {
    networkId: Network | "*"
    address: string
    status: string | "*"
    skip: number
    take: number
    from?: string | "null"
    to?: string | "null"
    collections?: Array<{ address: string; networkId: Network }>
    searchAddress?: string
    order?: {
      direction: "ASC" | "DESC"
      field: string
    }
  }): Promise<GetUserTradesListResponse> {
    try {
      const tradesList = (
        await this._fetchWithAuth<{ data: Array<GetUserTradesListResponse> }>(
          `${
            this._BACKEND_URL
          }/tradelist/getSwapList/${networkId}/${address}/${status}/${skip}/${take}${
            typeof searchAddress !== "undefined" && searchAddress !== null
              ? `/${searchAddress}`
              : ""
          }`,
          {
            method: "POST",
            body: {
              collections:
                typeof collections !== "undefined" ? collections : [],
              order: typeof order !== "undefined" ? order : null,
              from: typeof from !== "undefined" && from !== null ? from : null,
              to: typeof to !== "undefined" && to !== null ? to : null,
            },
          }
        )
      ).data?.data?.[0]

      if (!tradesList) throw new Error("Internal server error")

      return tradesList
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
    orderInit: CreateOrderInput
  ): Promise<CreateOrderInput> {
    const orderTypes = this._analyzeOrder(orderInit)
    const nftTraderFees: Maybe<NFTTraderFees> = await this._getNFTTraderFees()
    const nftTraderGnosis: Maybe<MultiSigWallet> =
      await this._getNFTTraderGnosis()

    let flatFee: string | undefined
    let basisPoints: number | undefined
    let gnosisRecipient = ""

    if (nftTraderFees) {
      flatFee = nftTraderFees.flatFee[0].fee
      basisPoints = nftTraderFees.percentageFee[0].basisPoints
    } else {
      flatFee = "0"
      basisPoints = 50
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
