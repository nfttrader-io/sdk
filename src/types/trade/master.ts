import Collector from "../../interfaces/post/collector"
/**
 * Represents a Master object containing various properties related to a swap transaction.
 */
export type Master = {
  /**
   * @property {string} imageUrl - The URL of the image associated with the swap.
   */
  imageUrl: string
  /**
   * @property {string} name - The name of the swap.
   */
  name: string
  /**
   * @property {string} symbol - The symbol of the swap.
   */
  symbol: string
  /**
   * @property {string} valueMaker - The value for the maker.
   */
  valueMaker: string
  /**
   * @property {string} valueTaker - The value for the taker.
   */
  valueTaker: string
  /**
   * @property {string} flatFeeMaker - The flat fee for the maker.
   */
  flatFeeMaker: string
  /**
   * @property {number} flatFeeMakerNative - The flat fee for the maker in native currency.
   */
  flatFeeMakerNative: number
  /**
   * @property {string} flatFeeTaker -
   */
  flatFeeTaker: string
  /**
   * @property {number} flatFeeTakerNative - The flat fee taken by the taker in native currency.
   */
  flatFeeTakerNative: number
  /**
   * @property {string} percentageFeeMaker - The percentage fee taken by the maker.
   */
  percentageFeeMaker: string
  /**
   * @property {number} percentageFeeMakerNative - The percentage fee taken by the maker in native currency.
   */
  percentageFeeMakerNative: number
  /**
   * @property {string} percentageFeeTaker - The percentage fee taken by the taker.
   */
  percentageFeeTaker: string
  /**
   * @property {number} percentageFeeTakerNative - The percentage fee taken by the taker in native currency.
   */
  percentageFeeTakerNative: number
  /**
   * @property {number} swapStatus - The status of the swap transaction.
   */
  swapStatus: number
  /**
   * @property {string} swapEnd - The end of the swap transaction.
   */
  swapEnd: string
  /**
   * @property {string} txHash - The transaction hash of the swap.
   */
  txHash: string
  /**
   * @property {Array<Collector>} maker - An array of collectors representing the maker of the swap.
   */
  maker: Array<Collector>
  /**
   * @property {Array<Collector>} taker - An array of collectors representing the taker of the swap.
   */
  taker: Array<Collector>
  /**
   * @property {Array<Object>} collections - An array of collections involved in the swap, each with the following properties:
   */
  collections: Array<{
    /**
     * @property {0 | 1} creator - Identify the creator of the swap.
     */
    creator: 0 | 1
    /**
     * @property {string} networkId - The network ID of the collection.
     */
    networkId: string
    /**
     * @property {string} collectionAddress - The address of the token collection.
     */
    collectionAddress: string
    /**
     * @property {Array<any>} abi - The ABI (Application Binary Interface) of the token.
     */
    abi: Array<any>
    /**
     * @property {string} name - The name of the token.
     */
    name: string
    /**
     * @property {string} symbol - The symbol of the token.
     */
    symbol: string
    /**
     * @property {string} assetLogo - The URL of the token's logo.
     */
    assetLogo: string
    /**
     * @property {"ERC721" | "ERC1155" | "ERC20" | "NATIVE"} type - The type of token (ERC721, ERC1155, ERC20, NATIVE).
     */
    type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
    /**
     * @property {-1 | 0 | 1 | 2} statusVerification - The status verification of the collection.
     */
    statusVerification: -1 | 0 | 1 | 2
  }>
}
