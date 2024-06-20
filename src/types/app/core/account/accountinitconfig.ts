import { Maybe } from "../../../base"

export type AccountInitConfig = {
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
   * @property {boolean | null} firstLogin - Indicates if it's the user's first login.
   */
  firstLogin: Maybe<boolean>
  /**
   * @property {string | null} avatarUrl - The URL of the user's avatar, if available.
   */
  avatarUrl: Maybe<string>
  /**
   * @property {boolean} isVerified - Represents if the user is verified or not.
   */
  isVerified: Maybe<boolean>
  /**
   * @property {Maybe<boolean>} isNft - Indicates if the item is an NFT (0 or 1).
   */
  isNft: Maybe<boolean>
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
  /**
   * @property {Maybe<string>} publicKey -
   */
  publicKey?: Maybe<string>
  /**
   * @property {Maybe<string>} encryptedPrivateKey -
   */
  encryptedPrivateKey?: Maybe<string>
  /**
   * @property {Maybe<string>} encryptedSecret -
   */
  encryptedSecret?: Maybe<string>
}
