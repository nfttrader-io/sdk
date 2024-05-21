/**
 * Represents the response object received after a successful sign-in operation.
 * @interface SigninResponse
 */
import { Maybe } from "../../types/base"

export interface SigninResponse {
  /**
   * @property {Array} data - An array of user data objects.
   */
  data: Array<{
    /**
     * @property {string} data.nonce - The nonce value associated with the user.
     */
    nonce: string
    /**
     * @property {string} data.jwt - The JSON Web Token (JWT) for the user.
     */
    jwt: string
    /**
     * @property {Maybe<string>} data.username - The username of the user, if available.
     */
    username: Maybe<string>
    /**
     * @property {Maybe<string>} data.email - The email address of the user, if available.
     */
    email: Maybe<string>
    /**
     * @property {Maybe<string>} data.bio - The biography of the user, if available.
     */
    bio: Maybe<string>
    /**
     * @property {Maybe<0 | 1>} data.firstLogin - Indicates if the user is logging in for the first time.
     */
    firstLogin: Maybe<0 | 1>
    /**
     * @property {Maybe<string>} avatarUrl - The URL of the user's avatar.
     */
    avatarUrl: Maybe<string>
    /**
     * @property {Maybe<0 | 1>} isVerified - Indicates if the user is verified (0 - not verified, 1 - verified).
     */
    isVerified: Maybe<0 | 1>
    /**
     * @property {Maybe<0 | 1>} isNft - Indicates if the user is associated with an NFT (0 - not associated, 1 - associated).
     */
    isNft: Maybe<0 | 1>
    /**
     * @property {Maybe<string>} tokenId - The token ID associated with the user.
     */
    tokenId: Maybe<string>
    /**
     * @property {Maybe<string>} collectionAddress - The address of the collection associated with the user.
     */
    collectionAddress: Maybe<string>
    /**
     * @property {Maybe<string>} createdAt - The date and time when the user was created.
     */
    createdAt: Maybe<string>
    /**
     * @property {Maybe<string>} updatedAt - The date and time when the user was updated.
     */
    updatedAt: Maybe<string>
  }>
}
