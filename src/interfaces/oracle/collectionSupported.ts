/**
 * Interface representing a collection that is supported.
 * @interface CollectionSupported
 */
export interface CollectionSupported {
  /**
   * @property {string} address - The address of the collection.
   */
  address: string
  /**
   * @property {string} networkId - The network ID of the collection.
   */
  networkId: string
  /**
   * @property {boolean} supported - Indicates if the collection is supported.
   */
  supported: boolean
}
