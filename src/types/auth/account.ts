import { Maybe } from "../base"

/**
 * Represents a user object with various properties.
 */
export type Account = {
  /**
   * @property {string} nonce - The nonce of the user.
   */
  nonce: string
  /**
   * @property {string} jwt - The JSON Web Token of the user.
   */
  jwt: string
  /**
   * @property {string | null} username - The username of the user, if available.
   */
  username: Maybe<string>
  /**
   * @property {string | null} email - The email of the user, if available.
   */
  email: Maybe<string>
  /**
   * @property {string | null} bio - The bio of the user, if available.
   */
  bio: Maybe<string>
  /**
   * @property {0 | 1 | null} firstLogin - Indicates if it's the user's first login.
   */
  firstLogin: Maybe<0 | 1>
  /**
   * @property {string | null} avatarUrl - The URL of the user's avatar, if available.
   */
  avatarUrl: Maybe<string>
  /**
   * @property {0 | 1} Maybe - Represents a value that may be 0 or 1.
   */
  isVerified: Maybe<0 | 1>
  /**
   * @property {Maybe<0 | 1>} isNft - Indicates if the item is an NFT (0 or 1).
   */
  isNft: Maybe<0 | 1>
  /**
   * @property {Maybe<string>} tokenId - The token ID of the NFT.
   */
  tokenId: Maybe<string>
  /**
   * @property {Maybe<string>} collectionAddress - The address of the NFT collection.
   */
  collectionAddress: Maybe<string>
  /**
   * @property {Maybe<string>} createdAt - The creation date of the NFT.
   */
  createdAt: Maybe<string>
  /**
   * @property {Maybe<string>} updatedAt - The last update date of the NFT.
   */
  updatedAt: Maybe<string>
}
