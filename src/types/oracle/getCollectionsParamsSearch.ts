/**
 * Represents the parameters for searching collections.
 */
type GetCollectionsParamsSearch = {
  /**
   * @property {string} userAddress - The address of the user performing the search.
   */
  userAddress: string
  /**
   * @property {"NFT" | "TKN" | "ALL"} searchType - The type of search to perform ("NFT", "TKN", or "ALL").
   */
  searchType: "NFT" | "TKN" | "ALL"
  /**
   * @property {number} skip - The number of items to skip in the search results.
   */
  skip: number
  /**
   * @property {number} take - The number of items to take in the search results.
   */
  take: number
  /**
   * @property {string} [networkId] - Optional network ID for the search.
   */
  networkId?: string
  /**
   * @property {string} [queryString] - Optional query string for additional search parameters.
   */
  queryString?: string
}

export { GetCollectionsParamsSearch }
