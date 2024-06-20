/**
 * Interface representing a collector with specific properties.
 * @interface Collector
 */
export interface Collector {
  /**
   * @property {string} username - The username of the collector.
   */
  username: string
  /**
   * @property {string} address - The address of the collector.
   */
  address: string
  /**
   * @property {string} imageUrl - The image URL of the collector.
   */
  imageUrl: string
  /**
   * @property {boolean} isVerified - Indicates if the collector is verified (0 for false, 1 for true).
   */
  isVerified: boolean
  /**
   * @property {boolean} isNft - Indicates if the collector is an NFT collector (0 for false, 1 for true).
   */
  isNft: boolean
  /**
   * @property {string} [networkId] - The network ID of the collector (optional).
   */
  networkId?: string
  /**
   * @property {boolean} [isFavourite] -
   */
  isFavourite?: boolean
  /**
   * @property {boolean} [isRegistered] - Identify if the user is registered or not (optional).
   */
  isRegistered?: boolean
}
