import Maybe from "../../types/general/maybe"

/**
 * Represents a collection with specific properties.
 * @interface Collection
 */
export interface Collection {
  /**
   * @property {string} name - The name of the collection.
   */
  name: string
  /**
   * @property {-1 | 0 | 1 | 2} statusVerification - The verification status of the collection.
   */
  statusVerification: -1 | 0 | 1 | 2
  /**
   * @property {string} address - The address of the collection.
   */
  address: string
  /**
   * @property {Maybe<string>} imageUrl - The URL of the image associated with the collection.
   */
  imageUrl: Maybe<string>
  /**
   * @property {string} networkId - The network ID of the collection.
   */
  networkId: string
  /**
   * @property {Maybe<Array<any>>} abi - The ABI (Application Binary Interface) of the collection.
   */
  abi: Maybe<Array<any>>
  /**
   * @property {"ERC721" | "ERC1155" | "ERC20" | "NATIVE"} type - The type of the collection.
   */
  type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
  /**
   * @property {Maybe<string>} symbol - The symbol of the collection.
   */
  symbol: Maybe<string>
  /**
   * @property {Maybe<string>} createdAt - The creation date of the collection.
   */
  createdAt: Maybe<string>
  /**
   * @property {0 | 1} isFavourite - Identifies if the collection is placed in the favourite list of the current user.
   */
  isFavourite?: 0 | 1
  /**
   * @property {boolean} notification - Identifies if the collection is in the notification list of the current user.
   */
  notification?: boolean
}
