/**
 * Interface for the arguments used to find users by username or address.
 * @interface FindUsersByUsernameOrAddressArgs
 */
export interface FindUsersByUsernameOrAddressArgs {
  /**
   * @property {string} searchTerm - The search term to look for in usernames or addresses.
   */
  searchTerm: string
  /**
   * @property {string} [nextToken] - An optional token for pagination to retrieve the next set of results.
   */
  nextToken?: string
}
