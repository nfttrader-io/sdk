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
import {
  DealDetail,
  DealMaster,
  SwapDetail,
} from "./types/tradeClient/swapDetail"
import SwapParameters from "./types/tradeClient/swapParameters"
import TradeClientJsonRpcInit from "./types/tradeClient/tradeClientJsonRpcInit"
import TradeClientWeb3Init from "./types/tradeClient/tradeClientWeb3Init"
import WithAddress from "./types/tradeClient/withAddress"
const {
  royaltyRegistriesEngines,
  seaportSmartContracts,
  royaltyRegistryEngineAbi,
} = contracts

// TODO rename in tradeClient.ts, this will be the only tradeClient
// TODO change import in index.ts
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
  private _BACKEND_URL: string = "https://develop.api.nfttrader.io" // TODO in prod delete "develop.""

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
          "jsonRpcProvider must be a string -> Eg. https://rinkeby.infura.io/v3/..."
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
    this._seaport = new Seaport(this._provider)

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
      : network === "1"
      ? 7
      : 35

    if (
      (!("jwt" in config) && !("apiKey" in config)) ||
      ("jwt" in config &&
        (typeof config.jwt !== "string" || !config.jwt.length)) ||
      ("apiKey" in config &&
        (typeof config.apiKey !== "string" || !config.apiKey.length))
    )
      throw new Error("At least apiKey or jwt must be passed")

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
   *
   */
  public getSeaportContractsAddresses(): Record<Network, string> {
    return seaportSmartContracts
  }

  /**
   * Get a list of all royalties engine smart contracts address deployed
   *
   */
  public getRoyaltyRegistriesEngines(): Record<Network, string> {
    return royaltyRegistriesEngines
  }

  /**
   * Get the ABI of the royalty engine smart contract
   *
   */
  public getRoyaltyRegistryEngineABI(): Array<any> {
    return royaltyRegistryEngineAbi
  }

  //todo
  private _getNFTTraderGnosis = async (): Promise<MultiSigWallet | null> => {
    try {
      const response = await this._fetchWithAuth<MultiSigWallet>(
        `${this._BACKEND_URL}/wallet/multisigWallet/${this._network}`
      )

      if (response.data) {
        return response.data
      } else {
        console.warn("no data field in response")
        return null
      }
    } catch (error) {
      console.warn(error)
      return null
    }
  }

  //todo
  private _getNFTTraderFees = async (): Promise<NFTTraderFees | null> => {
    try {
      const response = await this._fetchWithAuth<NFTTraderFees>(
        `${this._BACKEND_URL}/fee/nftTraderFee/${this._network}`
      )

      if (response.data) {
        return response.data
      } else {
        console.warn("no data field in response")
        return null
      }
    } catch (error) {
      console.warn(error)
      return null
    }
  }

  private _analyzeOrder = (orderInit: CreateOrderInput) => {
    let ohasNFT: boolean = false,
      ohasToken: boolean = false,
      oNFTs: number = 0,
      oNFTcollections: Array<string> = [],
      oNFTcollectionsIdentifiers: Array<Array<string>> = []
    if (
      orderInit != null &&
      orderInit.constructor.name === "Object" &&
      orderInit.hasOwnProperty("offer")
    )
      if (Array.isArray(orderInit.offer) && orderInit.offer.length > 0) {
        orderInit.offer.forEach((offer: any) => {
          if (offer && offer.hasOwnProperty("itemType")) {
            switch (offer.itemType) {
              case ItemType.ERC721:
                ohasNFT = true
                oNFTs++
                if (offer.token && !oNFTcollections.includes(offer.token))
                  oNFTcollections.push(offer.token)
                if (
                  offer.token &&
                  oNFTcollectionsIdentifiers[offer.token] == undefined
                )
                  oNFTcollectionsIdentifiers[offer.token] = []
                oNFTcollectionsIdentifiers[offer.token].push(offer.identifier)
                break
              case ItemType.ERC20:
                ohasToken = true
                break
              case ItemType.ERC1155:
                break
              case ItemType.NATIVE:
                ohasToken = true
                break
            }
          } else {
            ohasToken = true
          }
        })
      }

    let chasNFT: boolean = false,
      chasToken: boolean = false,
      cNFTs: number = 0,
      cNFTcollections: Array<string> = [],
      cNFTcollectionsIdentifiers: Array<Array<string>> = []
    if (
      orderInit != null &&
      orderInit.constructor.name === "Object" &&
      orderInit.hasOwnProperty("consideration")
    )
      if (
        Array.isArray(orderInit.consideration) &&
        orderInit.consideration.length > 0
      ) {
        orderInit.consideration.forEach((consideration: any) => {
          if (consideration && consideration.hasOwnProperty("itemType")) {
            switch (consideration.itemType) {
              case ItemType.ERC721:
                chasNFT = true
                cNFTs++
                if (!cNFTcollections.includes(consideration.token))
                  cNFTcollections.push(consideration.token)
                if (
                  consideration.token &&
                  cNFTcollectionsIdentifiers[consideration.token] == undefined
                )
                  cNFTcollectionsIdentifiers[consideration.token] = []
                cNFTcollectionsIdentifiers[consideration.token].push(
                  consideration.identifier
                )
                break
              case ItemType.ERC20:
                chasToken = true
                break
              case ItemType.NATIVE:
                chasToken = true
                break
              case ItemType.ERC1155:
                break
            }
          } else {
            chasToken = true
          }
        })
      }

    return {
      offer: {
        hasNFT: ohasNFT,
        hasToken: ohasToken,
        NFTs: oNFTs,
        NFTcollections: oNFTcollections,
        NFTcollectionsIdentifiers: oNFTcollectionsIdentifiers,
      },
      consideration: {
        hasNFT: chasNFT,
        hasToken: chasToken,
        NFTs: cNFTs,
        NFTcollections: cNFTcollections,
        NFTcollectionsIdentifiers: cNFTcollectionsIdentifiers,
      },
    }
  }

  private _addNFTTraderFee = async (
    orderInit: CreateOrderInput
  ): Promise<CreateOrderInput> => {
    const orderTypes = this._analyzeOrder(orderInit)
    const nftTraderFees: NFTTraderFees | null = await this._getNFTTraderFees()
    const nftTraderGnosis: MultiSigWallet | null =
      await this._getNFTTraderGnosis()

    let flatFee: string | undefined
    let basisPoints: number | undefined
    let gnosisRecipient: string = ""

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
          ...orderInit.consideration.concat([
            {
              recipient: gnosisRecipient,
              amount: ethers.utils.parseEther(flatFee).toString(),
            },
          ]),
        ],
      }
    }

    if (
      this._network &&
      orderTypes.consideration.hasToken &&
      orderTypes.offer.hasNFT &&
      orderTypes.offer.NFTcollections.length == 1
    ) {
      orderInit.fees = [
        {
          recipient: gnosisRecipient,
          basisPoints: basisPoints,
        },
      ]
    }
    return orderInit
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
    fees?: Array<Fee>
  ): Promise<Swap> {
    if (end < 0) throw new Error("swapEnd cannot be lower than zero.")

    const [addressMaker] = await this._provider.listAccounts()

    const orderInit = await this._addNFTTraderFee({
      offer: [...(maker.assets ?? [])].map(
        (a) =>
          ({
            ...a,
            itemType:
              typeof a.itemType === "string"
                ? AssetsArray.TOKEN_COSTANTS[a.itemType]
                : a.itemType,
          } as { itemType: ItemType } & typeof a)
      ),
      consideration: [...(taker.assets ?? [])].map(
        (a) =>
          ({
            ...a,
            itemType:
              typeof a.itemType === "string"
                ? AssetsArray.TOKEN_COSTANTS[a.itemType]
                : a.itemType,
            recipient: a.recipient ? a.recipient : addressMaker,
          } as { itemType: ItemType } & typeof a)
      ),
      zone: taker.address,
      endTime: `${end}`,
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
      const response = await this._fetchWithAuth(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${swapId}`
      )
      if (response.data) {
        const data: SwapDetail = response.data[0]

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
            this.__emit("execSwapTransactionError", {
              error,
              typeError: "waitError",
            })
            return
          }
        } catch (error) {
          this.__emit("execSwapTransactionError", {
            error,
            typeError: "execSwapTransactionError",
          })
        }
      } else {
        this.__emit("execSwapError", {
          error: "response data is empty",
          typeError: "ApiError",
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
   * @param {string} swapId - The id of the swap
   * @param {number} gasLimit - the gas limit of the transaction
   * @param {string} gasPrice - the gas price of the transaction
   */
  public async cancelSwap(
    swapId: string,
    gasLimit: number = 2000000,
    gasPrice: string | null = null
  ) {
    try {
      const response = await this._fetchWithAuth(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${swapId}`
      )
      if (response.data) {
        const data: SwapDetail = response.data[0]
        const parameters = data.parameters.order.parameters
        const maker = data.parameters.addressMaker
        const txOverrides: { gasLimit?: number; gasPrice?: string } = {}

        gasLimit && gasLimit !== 2000000 && (txOverrides["gasLimit"] = gasLimit)
        gasPrice && (txOverrides["gasPrice"] = gasPrice)

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
            this.__emit("cancelSwapTransactionError", {
              error,
              typeError: "waitError",
            })
            return
          }
        } catch (error) {
          this.__emit("cancelSwapTransactionError", {
            error,
            typeError: "cancelSwapTransactionError",
          })
          return
        }
      } else {
        this.__emit("cancelSwapError", {
          error: "response data is empty",
          typeError: "ApiError",
        })
      }
    } catch (error) {
      this.__emit("cancelSwapError", {
        error,
        typeError: "ApiError",
      })
    }
  }

  public async getSwapOrder(swapId: string): Promise<SwapDetail | null> {
    try {
      const response = await this._fetchWithAuth<Array<SwapDetail>>(
        `${this._BACKEND_URL}/tradelist/getSwapDetail/${this._network}/${swapId}`
      )

      if (response.data) {
        return response.data[0]
      }
    } catch (error) {
      console.warn(error)
    }
    return null
  }
}
