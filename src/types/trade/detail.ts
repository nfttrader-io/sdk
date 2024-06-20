import { Maybe } from "../base"
/**
 * Represents a detailed object with various properties related to a collection.
 */
export type Detail = {
  /**
   * @property {Maybe<string>} blc - The BLC property, possibly a string.
   */
  blc: Maybe<string>
  /**
   * @property {number} blcNative - The native BLC value as a number.
   */
  blcNative: number
  /**
   * @property {string} blcPercentage - The BLC percentage as a string.
   */
  blcPercentage: string
  /**
   * @property {number} blcPercentageNative - The native BLC percentage as a number.
   */
  blcPercentageNative: number
  /**
   * @property {string} collectionAddress - The address of the collection.
   */
  collectionAddress: string
  /**
   * @property {string} collectionLogo - The URL of the collection's logo.
   */
  collectionLogo: string
  /**
   * @property {boolean} creator - The creator identifier.
   */
  creator: boolean
  /**
   * Represents a token with the following properties:
   * @property {string} networkId - The network ID of the token.
   */
  networkId: string
  /**
   * @property {string} imageUrl - The URL of the token's image.
   */
  imageUrl: string
  /**
   * @property {boolean} isImg - Indicates whether the token has an image (0 for no, 1 for yes).
   */
  isImg: boolean
  /**
   * @property {Maybe<string>} name - The name of the token, or null if not available.
   */
  name: Maybe<string>
  /**
   * @property {-1 | 0 | 1 | 2} statusVerification - The verification status of the token.
   */
  statusVerification: -1 | 0 | 1 | 2
  /**
   * @property {string} swapId - The swap ID of the token.
   */
  swapId: string
  /**
   * @property {string} symbol - The symbol of the token.
   */
  symbol: string
  /**
   * @property {Maybe<string>} tokenId - The ID of the token, can be null.
   */
  tokenId: Maybe<string>
  /**
   * @property {number} tokenUSDValue - The USD value of the token.
   */
  tokenUSDValue: number
  /**
   * @property {"ERC721" | "ERC20" | "ERC1155" | "NATIVE"} type - The type of the token.
   */
  type: "ERC721" | "ERC20" | "ERC1155" | "NATIVE"
}
