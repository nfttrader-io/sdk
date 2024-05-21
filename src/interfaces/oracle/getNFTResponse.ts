/**
 * Represents the response object when fetching NFT data.
 * @interface GetNFTResponse
 */
import { Collectible } from "./collectible"

export interface GetNFTResponse {
  /**
   * @property {Array<{ nft: Collectible }>} data - An array of objects containing NFT collectibles.
   */
  data: Array<{ nft: Collectible }>
}
