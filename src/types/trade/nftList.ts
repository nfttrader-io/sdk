/**
 * Represents a list of NFTs with response, nfts array, and total count.
 */
type NFTList = {
  /**
   * @property {string} response - The response message.
   */
  response: string
  /**
   * @property {Array<any>} nfts - An array of NFTs.
   */
  nfts: Array<any>
  /**
   * @property {number} total - The total count of NFTs.
   */
  total: number
}

export default NFTList
