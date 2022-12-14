import { Seaport } from "@opensea/seaport-js"
import { ItemType } from "@opensea/seaport-js/lib/constants"
import { Fee, OrderWithCounter } from "@opensea/seaport-js/lib/types"
import { ethers } from "ethers"
import AssetsArray from "./assetsArray"
import contracts from "./lib/contracts"
import events from "./lib/events"
import CallbackParams from "./types/tradeClient/callbackParams"
import CreateSwapPeer from "./types/tradeClient/createSwapPeer"
import TradeClientEventsMap from "./types/tradeClient/eventsMap"
import Swap from "./types/tradeClient/swap"
import SwapParameters from "./types/tradeClient/swapParameters"
import TradeClientInit from "./types/tradeClient/tradeClientInit"
const { swap, contractAbi } = contracts

// TODO rename in tradeClient.ts, this will be the only tradeClient
// TODO change import in index.ts
export default class TradeClient {
  private isJsonRpcProvider = false
  private isWeb3Provider = false
  private provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
  private seaport: Seaport
  private contract: ethers.Contract
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
  private blocksNumberConfirmationRequired: number

  /**
   * Create an instance of the NFTTrader TradeClient object.
   *
   * @param config - Configuration object for the sdk.
   */
  constructor(config: TradeClientInit) {
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

      this.isJsonRpcProvider = true
      this.provider = new ethers.providers.JsonRpcProvider(
        config.jsonRpcProvider
      )
    } else {
      if (
        typeof config.web3Provider !== "object" ||
        Array.isArray(config.web3Provider)
      )
        throw new Error("web3Provider must be an object -> Eg. window.ethereum")

      this.isWeb3Provider = true
      this.provider = !(
        config.web3Provider instanceof ethers.providers.Web3Provider
      )
        ? new ethers.providers.Web3Provider(config.web3Provider)
        : config.web3Provider
    }
    this.seaport = new Seaport(this.provider)

    const { network, blocksNumberConfirmationRequired } = config
    if (!network) throw new Error("network must be passed")
    if (!Object.keys(swap).includes(network)) throw new Error("Invalid network")
    if (
      blocksNumberConfirmationRequired !== undefined &&
      blocksNumberConfirmationRequired !== null &&
      blocksNumberConfirmationRequired < 1
    )
      throw new Error(
        "blocksNumberConfirmationRequired cannot be lower than one."
      )

    this.contract = new ethers.Contract(
      swap[network],
      contractAbi,
      this.provider
    )

    this.blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
      ? blocksNumberConfirmationRequired
      : network === "ETHEREUM"
      ? 7
      : 35
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
    const event = this.eventsCollectorCallbacks.find(eventItem => {
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
    const event = this.eventsCollectorCallbacks.find(eventItem => {
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
      const index = event.callbacks.findIndex(func => {
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
    const event = this.eventsCollectorCallbacks.find(eventItem => {
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

    this.blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
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
    taker: CreateSwapPeer,
    end = 0,
    fees?: Array<Fee>
  ): Promise<Swap> {
    if (end < 0) throw new Error("swapEnd cannot be lower than zero.")

    const [addressMaker] = await this.provider.listAccounts()

    const { executeAllActions } = await this.seaport.createOrder(
      {
        offer: [...(maker.assets ?? [])].map(
          a =>
            ({
              ...a,
              itemType:
                typeof a.itemType === "string"
                  ? AssetsArray.TOKEN_COSTANTS[a.itemType]
                  : a.itemType,
            } as { itemType: ItemType } & typeof a)
        ),
        consideration: [...(taker.assets ?? [])]
          .filter(a => a.recipient?.length)
          .map(
            a =>
              ({
                ...a,
                itemType:
                  typeof a.itemType === "string"
                    ? AssetsArray.TOKEN_COSTANTS[a.itemType]
                    : a.itemType,
              } as { itemType: ItemType } & typeof a)
          ),
        endTime: `${end}`,
        fees,
      },
      addressMaker
    )

    return executeAllActions()
  }

  public async closeSwap(order: Swap, taker: string) {
    const { executeAllActions } = await this.seaport.fulfillOrder({
      order,
      accountAddress: taker,
    })

    return executeAllActions()
  }

  public async cancelSwap(orderParameters: SwapParameters, maker: string) {
    const tx = this.seaport.cancelOrders([orderParameters], maker)

    try {
      tx.estimateGas()
    } catch (e) {
      throw new Error("TX reverted")
    }

    return tx.transact()
  }
}
