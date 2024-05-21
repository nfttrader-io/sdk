/**
 * Represents the response object when fetching NFTs.
 * @interface GetNFTsResponse
 */
import { Maybe } from "../../types/base"
import { Collectible } from "./collectible"

export interface GetNFTsResponse {
  /**
   * @property {Array<{ nfts: Array<Collectible>, continuation: Maybe<string> | undefined, total: number }>} data - Array of NFTs with continuation token and total count.
   */
  data: Array<{
    nfts: Array<Collectible>
    continuation: Maybe<string> | undefined
    total: number
  }>
}
