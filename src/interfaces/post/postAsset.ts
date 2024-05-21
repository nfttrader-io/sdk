import { Maybe } from "../../types/base"
import { Collection } from "./collection"

/**
 * Represents a post asset with various properties.
 * @interface PostAsset
 */
export interface PostAsset {
  /**
   * @property {string} name - The name of the asset.
   */
  name: string
  /**
   * @property {number} statusVerification - The status verification code (-1, 0, 1, 2).
   */
  statusVerification: -1 | 0 | 1 | 2
  /**
   * @property {string} address - The address of the asset.
   */
  address: string
  /**
   * @property {string} imageUrl - The URL of the asset's image.
   */
  imageUrl: string
  /**
   * @property {string} networkId - The network ID of the asset.
   */
  networkId: string
  /**
   * @property {Maybe<Array<any>>} abi - The ABI (Application Binary Interface) of the asset.
   */
  abi: Maybe<Array<any>>
  /**
   * @property {"ERC721" | "ERC1155" | "ERC20" | "NATIVE"} type - The type
   */
  type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
  /**
   * Represents an NFT (Non-Fungible Token) with the following properties:
   * @property {boolean} isNft - Indicates if the item is an NFT.
   */
  isNft: boolean
  /**
   * @property {string} symbol - The symbol associated with the NFT.
   */
  symbol: string
  /**
   * @property {Maybe<string>} createdAt - The creation date of the NFT, if available.
   */
  createdAt: Maybe<string>
  /**
   * @property {Maybe<string>} tokenId - The unique identifier of the NFT, if available.
   */
  tokenId: Maybe<string>
  /**
   * @property {Maybe<string>} amount - The amount of the NFT, if available.
   */
  amount: Maybe<string>
  /**
   * @property {Maybe<string>} amountHumanReadable - The human-readable amount of the NFT, if available.
   */
  amountHumanReadable: Maybe<string>
  /**
   * @property {boolean} isDifferent - Indicates if the item is different than what expected.
   */
  isDifferent: boolean
  /**
   * @property {Collection} [collection] - the collection attached to this asset.
   */
  collection?: Collection
}
