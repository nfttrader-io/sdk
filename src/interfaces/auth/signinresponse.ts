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
     * @property {Maybe<boolean>} data.firstLogin - Indicates if the user is logging in for the first time.
     */
    firstLogin: Maybe<boolean>
    /**
     * @property {Maybe<string>} avatarUrl - The URL of the user's avatar.
     */
    avatarUrl: Maybe<string>
    /**
     * @property {Maybe<boolean>} isVerified - Indicates if the user is verified (false - not verified, true - verified).
     */
    isVerified: Maybe<boolean>
    /**
     * @property {Maybe<boolean>} isNft - Indicates if the user is associated with an NFT (false - not associated, true - associated).
     */
    isNft: Maybe<boolean>
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
