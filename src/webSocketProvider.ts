import * as ethers from "ethers"
import contracts from "../lib/contracts"
const { swap } = contracts

/**
 * This class contains the WebSocket Provider objects to listen the events emitted by the smart contract.
 *
 */
export default class WebSocketProvider {
  private webSocketProvider: ethers.providers.WebSocketProvider | null = null
  private contractAddressWebSocketProvider: string | null = null

  constructor({
    url,
    network,
  }: {
    url: string
    network: "ETHEREUM" | "RINKEBY" | "POLYGON" | "MUMBAI"
  }) {
    try {
      this.webSocketProvider = new ethers.providers.WebSocketProvider(
        url,
        network
      )

      this.contractAddressWebSocketProvider = swap[network]
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Execute the callback when a SwapEvent is emitted by the smart contract.
   *
   * @param callback - The callback function to execute.
   * @param topic - The topic object for filtering a specific swapEvent.
   */
  public onSwapEvent(
    callback: (...args: Array<any>) => void,
    {
      creator = null,
      time = null,
      status = null,
    }: {
      /**
       * The creator address of the swap.
       */
      creator?: string | null
      /**
       * The creation time of the swap.
       */
      time?: string | null
      /**
       * The status of the swap.
       */
      status?: string | null
    }
  ) {
    if (callback === null || typeof callback === "undefined")
      throw new Error("callback must be provided")
    if (typeof callback !== "function")
      throw new Error("callback must be a Function.")
    if (!this.webSocketProvider) throw new Error("websocket provider unset")
    if (!this.contractAddressWebSocketProvider)
      throw new Error("websocket contract address unset")

    const filter = {
      address: this.contractAddressWebSocketProvider,
      topics: [
        ethers.utils.id(
          "swapEvent(address,uint256,uint8,uint256,address,address)"
        ),
        creator ? creator : null,
        time ? time : null,
        status ? status : null,
      ],
    }

    this.webSocketProvider.on(filter, callback)
  }

  /**
   * Execute the callback when a CounterpartEvent is emitted by the smart contract.
   *
   * @param callback - The callback function to execute.
   * @param topic - The topic object for filtering a specific counterpartEvent.
   */
  public onCounterpartEvent(
    callback: (...args: Array<any>) => void,
    {
      swapId = null,
      counterpart = null,
    }: {
      /**
       * The swap identifier.
       */
      swapId?: string | null
      /**
       * The address of the counterpart.
       */
      counterpart?: string | null
    }
  ) {
    if (callback === null || typeof callback === "undefined")
      throw new Error("callback must be provided")
    if (typeof callback !== "function")
      throw new Error("callback must be a Function.")
    if (!this.webSocketProvider) throw new Error("websocket provider unset")
    if (!this.contractAddressWebSocketProvider)
      throw new Error("websocket contract address unset")

    const filter = {
      address: this.contractAddressWebSocketProvider,
      topics: [
        ethers.utils.id("counterpartEvent(uint256,address)"),
        swapId ? swapId : null,
        counterpart ? counterpart : null,
      ],
    }

    this.webSocketProvider.on(filter, callback)
  }

  /**
   * Execute the callback when a PaymentReceived is emitted by the smart contract.
   *
   * @param callback - The callback function to execute.
   * @param topic - The topic object for filtering a specific paymentReceived.
   */
  public onPaymentReceived(
    callback: (...args: Array<any>) => void,
    {
      payer = null,
    }: {
      /**
       * he address of the payer.
       */
      payer: string | null
    }
  ) {
    if (callback === null || typeof callback === "undefined")
      throw new Error("callback must be provided")
    if (typeof callback !== "function")
      throw new Error("callback must be a Function.")
    if (!this.webSocketProvider) throw new Error("websocket provider unset")
    if (!this.contractAddressWebSocketProvider)
      throw new Error("websocket contract address unset")

    const filter = {
      address: this.contractAddressWebSocketProvider,
      topics: [
        ethers.utils.id("paymentReceived(address,uint256)"),
        payer ? payer : null,
      ],
    }

    this.webSocketProvider.on(filter, callback)
  }
}
