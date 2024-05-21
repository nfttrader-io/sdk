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
   * @property {0 | 1} isVerified - Indicates if the collector is verified (0 for false, 1 for true).
   */
  isVerified: 0 | 1
  /**
   * @property {0 | 1} isNft - Indicates if the collector is an NFT collector (0 for false, 1 for true).
   */
  isNft: 0 | 1
  /**
   * @property {string} [networkId] - The network ID of the collector (optional).
   */
  networkId?: string
  /**
   * @property {0 | 1} [isFavourite] -
   */
  isFavourite?: 0 | 1
  /**
   * @property {0 | 1} [isRegistered] - Identify if the user is registered or not (optional).
   */
  isRegistered?: 0 | 1
}
