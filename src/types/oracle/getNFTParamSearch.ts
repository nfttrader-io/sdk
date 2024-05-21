import { Network } from "../base"
/**
 * Defines the parameters required to search for an NFT.
 */
type GetNFTParamsSearch = {
  /**
   * @property {Network} networkId - The network ID on which the NFT exists.
   */
  networkId: Network
  /**
   * @property {string} collectionAddress - The address of the NFT collection.
   */
  collectionAddress: string
  /**
   * @property {string} tokenId - The ID of the specific NFT.
   */
  tokenId: string
  /**
   * @property {string} [address] - Optional address parameter for additional filtering.
   */
  address?: string
}

export { GetNFTParamsSearch }
