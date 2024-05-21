import Maybe from "../../types/general/maybe"
import { Collector } from "../post"

/**
 * Represents a trade order with detailed information about the trade.
 * @interface TradeOrder
 */
export interface TradeOrder {
  /**
   * @property {string} networkId - The network ID of the trade order.
   */
  networkId: string
  /**
   * @property {string} swapId - The unique identifier of the swap.
   */
  swapId: string
  /**
   * @property {0 | 1 | 2} swapStatus - The status of the swap (0 - pending, 1 - completed, 2 - cancelled).
   */
  swapStatus: 0 | 1 | 2
  /**
   * @property {string} txHash - The transaction hash of the trade.
   */
  txHash: string
  /**
   * @property {string} addressMaker - The address of the maker in the trade.
   */
  addressMaker: string
  /**
   * @property {Maybe<string>} usernameMaker - The username of the maker (optional).
   */
  usernameMaker: Maybe<string>
  /**
   * @property {string} valueMaker - The value
   */
  valueMaker: string
  /**
   * @property {string} addressTaker - The address of the taker in the deal.
   */
  addressTaker: string
  /**
   *@property {Maybe<string>} usernameTaker - The username of the taker, if available.
   */
  usernameTaker: Maybe<string>
  /**
   *@property {string} valueTaker - The value taken in the deal.
   */
  valueTaker: string
  /**
   *@property {string} name - The name of the deal.
   */
  name: string
  /**
   *@property {string} symbol - The symbol of the deal.
   */
  symbol: string
  /**
   *@property {string} imageUrl - The URL of the image associated with the deal.
   */
  imageUrl: string
  /**
   *@property {string} swapStart - The start of the swap in the deal.
   */
  swapStart: string
  /**
   * @property {string} swapEnd - The end of the swap in the deal
   */
  swapEnd: string
  /**
   * @property {"DIRECT_DEAL" | "PUBLIC_DEAL"} type - The type of deal.
   */
  type: "DIRECT_DEAL" | "PUBLIC_DEAL"
  /**
   *  @property {Array<Collector>} maker - An array of collectors representing the makers of the deal.
   */
  maker: Array<Collector>
  /**
   * @property {Array<Collector>} taker - An array of collectors representing the takers of the deal.
   */
  taker: Array<Collector>
  /**
   * @property {Array<{creator: 0 | 1, networkId: string, collectionAddress: string, abi: Array<any>, name: string, symbol: string, assetLogo: string, type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE", statusVerification: -1 | 0 | 1 | 2}>} collections - An array of collections
   */
  collections: Array<{
    creator: 0 | 1
    networkId: string
    collectionAddress: string
    abi: Array<any>
    name: string
    symbol: string
    assetLogo: string
    type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
    statusVerification: -1 | 0 | 1 | 2
  }>
}
