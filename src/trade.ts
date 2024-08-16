import { Seaport } from "@opensea/seaport-js"
import { ItemType } from "@opensea/seaport-js/lib/constants"
import { CreateOrderInput } from "@opensea/seaport-js/lib/types"
import { ethers } from "ethers"
import { AssetsArray } from "./core/assetsarray"
import { seaportSmartContracts } from "./constants/trade"
import events from "./constants/trade/events"
import { HTTPClient } from "./core/httpclient"
import { ApiKeyAuthorized, Maybe, Network } from "./types/base"
import {
  CallbackParams,
  TradeAsset,
  Fee,
  MultiSigWallet,
  NFTTraderFees,
  TradeInstance,
  TradeJsonRpcInit,
  TradeWeb3Init,
  WithAddress,
  TradeConfig,
  PartialTrade,
  TradeDetail,
  TradeListResponse,
} from "./types/trade"
import { TradeEvents } from "./interfaces/trade"
import { ApiResponse } from "./types/base/apiresponse"

/**
 * Trade class that handles interactions with the OpenSea trading platform.
 * @class Trade
 * @extends HTTPClient
 */

export class Trade extends HTTPClient {
  /**
   * @property {Maybe<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>} _provider - The provider instance.
   */
  private _provider: Maybe<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  > = null
  /**
   * @property {Maybe<Seaport>} _seaport - The Seaport instance.
   */
  private _seaport: Maybe<Seaport> = null
  /**
   * @property {_eventsCollectorCallbacks} - Array of objects containing event name and callbacks.
   */
  private _eventsCollectorCallbacks = events.map(
    <EventName extends keyof TradeEvents>(
      name: EventName
    ): {
      name: EventName
      callbacks: Array<TradeEvents[EventName]>
    } => ({
      name,
      callbacks: [],
    })
  )
  /**
   * @property {Maybe<Network>} _network - The network information.
   */
  private _network: Maybe<Network> = null
  /**
   * @property {number} _blocksNumberConfirmationRequired - The number of block confirmations required.
   */
  private _blocksNumberConfirmationRequired: number
  /**
   * @property {number} _MIN_BLOCKS_REQUIRED - The minimum number of block confirmations required
   */
  private _MIN_BLOCKS_REQUIRED: number = 3

  /**
   * Constructor for a class that requires an API key and optionally a number of blocks for confirmation.
   * @param {object} config - Configuration object containing API key and optional blocks number confirmation.
   * @param {string} config.apiKey - The API key for authorization.
   * @param {number} [config.blocksNumberConfirmationRequired] - The number of blocks required for confirmation.
   * @throws {Error} Throws an error if blocksNumberConfirmationRequired is less than 1 or if apiKey is missing or invalid.
   */
  constructor(config: ApiKeyAuthorized) {
    super()

    this._blocksNumberConfirmationRequired = this._MIN_BLOCKS_REQUIRED
    this._apiKey = config.apiKey
  }

  /**
   * Emits an event with the specified name and parameters to all registered callbacks for that event.
   * @param {EventName} eventName - The name of the event to emit.
   * @param {CallbackParams<TradeEvents[EventName]>} [params] - The parameters to pass to the event callbacks.
   * @returns None
   */
  private __emit<EventName extends keyof TradeEvents>(
    eventName: EventName,
    params?: CallbackParams<TradeEvents[EventName]>
  ) {
    const event = this._eventsCollectorCallbacks.find((eventItem) => {
      return eventItem.name === eventName
    })

    if (!event) throw new Error("event not found.")

    for (const cb of event.callbacks) cb(params as any)
  }

  /**
   * Asynchronously fetches the NFT Trader Gnosis multisig wallet from the backend API.
   * @returns {Promise<Maybe<<MultiSigWallet>>>} A promise that resolves to the multisig wallet object if successful,
   * or null if there was an error or no data was returned in the response.
   */
  private async _getNFTTraderGnosis(): Promise<Maybe<MultiSigWallet>> {
    try {
      const { response } = await this._fetch<ApiResponse<MultiSigWallet>>(
        `${this.backendUrl()}/wallet/multisigWallet/${this._network}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Asynchronously fetches NFT trader fees from the backend API.
   * @returns A Promise that resolves to a Maybe<NFTTraderFees> object.
   */
  private async _getNFTTraderFees(): Promise<Maybe<NFTTraderFees>> {
    try {
      const { response } = await this._fetch<ApiResponse<NFTTraderFees>>(
        `${this.backendUrl()}/fee/nftTraderFee/${this._network}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Analyzes the order initialization object to extract offer and consideration details.
   * @param {CreateOrderInput} orderInit - The order initialization object.
   * @returns An object containing offer and consideration details.
   */
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

  /**
   * Adds NFT trader fees to the given order input.
   * @param {CreateOrderInput} orderInit - The initial order input to add NFT trader fees to.
   * @returns {Promise<CreateOrderInput>} The order input with NFT trader fees added.
   */
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

    if (nftTraderGnosis) gnosisRecipient = nftTraderGnosis.multisigAddress

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

  /**
   * Initializes the client with the provided configuration for either TradeJsonRpcInit or TradeWeb3Init.
   * @param {TradeJsonRpcInit | TradeWeb3Init} config - The configuration object containing either a jsonRpcProvider or web3Provider.
   * @throws {Error} If both providers are provided or if neither provider is provided.
   * @throws {Error} If jsonRpcProvider is not a non-empty string or if web3Provider is not a non-array object.
   * @returns None
   */
  initClient(config: TradeJsonRpcInit | TradeWeb3Init) {
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

      this._provider = new ethers.providers.JsonRpcProvider(
        config.jsonRpcProvider
      )
    } else {
      if (
        typeof config.web3Provider !== "object" ||
        Array.isArray(config.web3Provider)
      )
        throw new Error("web3Provider must be an object -> Eg. window.ethereum")

      this._provider = !(
        config.web3Provider instanceof ethers.providers.Web3Provider
      )
        ? new ethers.providers.Web3Provider(config.web3Provider)
        : config.web3Provider
    }

    //this._seaport = new Seaport(this._provider, { seaportVersion: "1.6" })
  }

  /**
   * Registers a callback function for a specific event.
   * @param {EventName} eventName - The name of the event to listen for.
   * @param {TradeEvents[EventName]} callback - The callback function to be executed when the event occurs.
   * @returns None
   */
  on<EventName extends keyof TradeEvents>(
    eventName: EventName,
    callback: TradeEvents[EventName]
  ) {
    const event = this._eventsCollectorCallbacks.find((eventItem) => {
      return eventItem.name === eventName
    })

    if (!event) throw new Error("event not supported.")

    event.callbacks.push(callback)
  }

  /**
   * Sets the network ID for the contract.
   * @param {string} networkId - The network ID to set.
   * @throws {Error} If the network ID is not provided or is invalid.
   * @returns None
   */
  setNetworkId(networkId: string) {
    if (!networkId) throw new Error("network must be provided.")

    this._network = networkId as Network
  }

  /**
   * Unsubscribes a callback function from a specific event.
   * @param {EventName} eventName - The name of the event to unsubscribe from.
   * @param {Maybe<TradeEvents[EventName]>} [callback] - The callback function to unsubscribe.
   * @returns None
   * @throws {Error} If the event is not supported or the callback is not a function.
   */
  off<EventName extends keyof TradeEvents>(
    eventName: EventName,
    callback?: Maybe<TradeEvents[EventName]>
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
   * Set the block numbers to wait in which consider a transaction mined by the createTrade, cancelTrade and execTrade methods.
   * @param {number} blocksNumberConfirmationRequired - The number of blocks required for confirmation.
   * @throws {Error} If blocksNumberConfirmationRequired is less than 1.
   */
  setBlocksNumberConfirmationRequired(
    blocksNumberConfirmationRequired: number
  ) {
    if (blocksNumberConfirmationRequired < 1)
      throw new Error(
        "blocksNumberConfirmationRequired cannot be lower than one."
      )

    this._blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
  }

  /**
   * Retrieves the addresses of Seaport smart contracts for each network.
   * @returns {Record<Network, string>} An object mapping each network to its corresponding Seaport smart contract address.
   */
  getSeaportContractsAddresses(): Record<Network, string> {
    return seaportSmartContracts
  }

  /**
   * Creates a trade instance with the given maker and taker assets, along with additional parameters.
   * @param {TradeAsset<WithAddress>} maker - The assets offered by the maker.
   * @param {TradeAsset<WithAddress>} taker - The assets desired by the taker.
   * @param {number} [end=0] - The end time for the trade.
   * @param {string} signature - The signature for the trade.
   * @param {Array<Fee>} [fees] - Optional fees for the trade.
   * @param {Object} [post] - Optional post information for the trade.
   * @param {string} post.postId - The ID of the post.
   * @param {string} post.replyId - The reply id related to the offer accepted to initialize the trade
   */
  async create(
    maker: TradeAsset<WithAddress>,
    taker: TradeAsset<WithAddress>,
    end: number = 0,
    signature: string,
    fees?: Array<Fee>,
    post?: {
      postId: string
      replyId: string
    }
  ): Promise<TradeInstance> {
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
      await this._fetch(`${this.backendUrl()}/trade/insertTrade`, {
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
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${this._authToken}`,
        },
      })
    } catch (e) {
      console.warn(e)
    }

    return { hash: orderHash, ...order }
  }

  /**
   * Finalizes a trade by fetching trade details, executing the trade, and handling transaction events.
   * @param {string} tradeId - The ID of the trade to be finalized.
   * @returns None
   */
  async finalize(tradeId: string) {
    if (!this._seaport)
      throw new Error("initClient() must be called to initialize the client.")
    if (!this._network) throw new Error("network must be defined.")
    try {
      const { response } = await this._fetch<ApiResponse<TradeDetail>>(
        `${this.backendUrl()}/tradelist/getSwapDetail/${
          this._network
        }/${tradeId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response || !response.data)
        return this.__emit("execTradeError", {
          error: "response data is empty",
          typeError: "ApiError",
        })

      const { data: tradeDetail } = response
      const data: TradeDetail = tradeDetail[0]
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
          //const receipt = await transact.wait(
          //this._blocksNumberConfirmationRequired
          //)
          //this.__emit("execTradeTransactionMined", { receipt })
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
   * Cancels a trade with the given trade ID.
   * @param {string} tradeId - The ID of the trade to cancel.
   * @param {number} [gasLimit=2000000] - The gas limit for the transaction.
   * @param {Maybe<string>} [gasPrice=null] - The gas price for the transaction.
   * @returns None
   */
  async cancel(
    tradeId: string,
    gasLimit: number = 2000000,
    gasPrice: Maybe<string> = null
  ) {
    if (!this._seaport)
      throw new Error("initClient() must be called to initialize the client.")
    if (!this._network) throw new Error("network must be defined.")
    try {
      const { response } = await this._fetch<ApiResponse<TradeDetail>>(
        `${this.backendUrl()}/tradelist/getSwapDetail/${
          this._network
        }/${tradeId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response || !response.data)
        return this.__emit("execTradeError", {
          error: "response data is empty",
          typeError: "ApiError",
        })

      const { data: tradeDetail } = response
      const data: TradeDetail = tradeDetail[0]
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

          //this.__emit("cancelTradeTransactionMined", { receipt })
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
   * Retrieves trade details for a specific network and trade ID.
   * @param {string} networkId - The network ID for the trade.
   * @param {string} id - The ID of the trade.
   * @returns {Promise<Maybe<TradeDetail>>} A Promise that resolves to the trade detail information, or null if an error occurs.
   */
  async get(networkId: string, id: string): Promise<Maybe<TradeDetail>> {
    try {
      const { response } = await this._fetch<ApiResponse<TradeDetail>>(
        `${this.backendUrl()}/tradelist/getSwapDetail/${networkId}/${id}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves a list of global trades based on the provided parameters.
   * @param {object} options - An object containing the parameters for fetching the trades list.
   * @param {Network | "*"} networkId - The network ID or "*" for all networks.
   * @param {string | "*"} status - The status of the trades or "*" for all statuses.
   * @param {number} skip - The number of trades to skip.
   * @param {number} take - The number of trades to retrieve.
   * @param {string} [from] - Optional parameter for filtering trades from a specific date.
   * @param {string} [to] - Optional parameter for filtering trades up to a specific date.
   * @param {Array<{ address: string; networkId: Network }>} [collectios] - an raary of collections paired with their respective network.
   * @param {Array<string>} [search] - An array of search terms to filter results.
   * @param {object} [order] - An object containing direction and field for ordering results.
   * @param {string} order.direction - The direction of ordering, either "ASC" for ascending or "DESC" for descending.
   * @param {string} order.field - The field to order results by.
   */
  async getGlobalTradesList({
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
    from?: string
    to?: string
    collections?: Array<{ address: string; networkId: Network }>
    search?: Array<string>
    order?: {
      direction: "ASC" | "DESC"
      field: string
    }
  }): Promise<Maybe<TradeListResponse>> {
    try {
      const { response } = await this._fetch<ApiResponse<TradeListResponse>>(
        `${this.backendUrl()}/tradelist/getFullList/${networkId}/${status}/${skip}/${take}`,
        {
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
          method: "POST",
          body: {
            collections: typeof collections !== "undefined" ? collections : [],
            search: typeof search !== "undefined" ? search : [],
            order: typeof order !== "undefined" ? order : null,
            from: typeof from !== "undefined" ? from : null,
            to: typeof to !== "undefined" ? to : null,
          },
        }
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves a list of user trades based on the provided parameters.
   * @param {object} options - An object containing the parameters for fetching user trades.
   * @param {Network | "*"} networkId - The network ID or "*" for all networks.
   * @param {string} did - The user's did.
   * @param {string | "*"} status - The status of the trades or "*" for all statuses.
   * @param {number} skip - The number of trades to skip.
   * @param {number} take - The number of trades to retrieve.
   * @param {string} [from] - Optional parameter for filtering trades from a specific date.
   * @param {string} [to] - Optional parameter for filtering trades up to a specific date.
   * @param {Array<{ address: string; networkId: Network }>} [collectios] - an raary of collections paired with their respective network.
   * @param {Array<string>} [search] - An array of search terms to filter results.
   * @param {object} [order] - An object containing direction and field for ordering results.
   * @param {string} order.direction - The direction of ordering, either "ASC" for ascending or "DESC" for descending.
   * @param {string} order.field - The field to order results by.
   */
  async getUserTradesList({
    networkId,
    did,
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
    did: string
    status: string | "*"
    skip: number
    take: number
    from?: string
    to?: string
    collections?: Array<{ address: string; networkId: Network }>
    searchAddress?: string
    order?: {
      direction: "ASC" | "DESC"
      field: string
    }
  }): Promise<Maybe<TradeListResponse>> {
    try {
      const { response } = await this._fetch<ApiResponse<TradeListResponse>>(
        `${this.backendUrl()}/tradelist/getSwapList/${networkId}/${did}/${status}/${skip}/${take}${
          typeof searchAddress !== "undefined" && searchAddress !== null
            ? `/${searchAddress}`
            : ""
        }`,
        {
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
          method: "POST",
          body: {
            collections: typeof collections !== "undefined" ? collections : [],
            order: typeof order !== "undefined" ? order : null,
            from: typeof from !== "undefined" ? from : null,
            to: typeof to !== "undefined" ? to : null,
          },
        }
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Updates the configuration settings for the trade module.
   * @param {TradeConfig} config - The configuration object for the trade module.
   * @returns None
   */
  config(config: TradeConfig) {
    if (config.minBlocksRequired)
      this._MIN_BLOCKS_REQUIRED = config.minBlocksRequired
  }
}
