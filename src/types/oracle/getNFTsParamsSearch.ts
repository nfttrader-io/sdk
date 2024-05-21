import { Network } from "../base"

/**
 * Defines the parameters for searching NFTs.
 */
type GetNFTsParamsSearch = {
  /**
   * @property {Network} networkId - The network ID for the NFTs.
   */
  networkId: Network
  /**
   * @property {string} address - The address to search for NFTs.
   */
  address: string
  /**
   * @property {number} take - The number of NFTs to retrieve.
   */
  take: number
  /**
   * @property {Array<{ address: string }>} [collections] - Optional array of collection addresses.
   */
  collections?: Array<{ address: string }>
  /**
   * @property {string} [continuation] - Optional continuation token for pagination.
   */
  continuation?: string
}

export { GetNFTsParamsSearch }
