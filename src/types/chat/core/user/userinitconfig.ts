import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"

/**
 * Represents the initial configuration for a user.
 * @type UserInitConfig
 */
export type UserInitConfig = {
  /**
   * @property {string} id - The unique identifier for the user.
   */
  id: string
  /**
   * @property {string} did - The did of the user.
   */
  did: string
  /**
   * @property {string} address - The address of the user.
   */
  address: string
  /**
   * @property {Maybe<string>} username - The username of the user, if available.
   */
  username: Maybe<string>
  /**
   * @property {Maybe<string>} email - The email address of the user, if available.
   */
  email: Maybe<string>
  /**
   * @property {Maybe<string>} bio - The biography of the user, if available.
   */
  bio: Maybe<string>
  /**
   * @property {Maybe<URL>} avatarUrl - The URL of the user's avatar, if available.
   */
  avatarUrl: Maybe<URL>
  /**
   * @property {boolean} isVerified - Indicates if the user is verified.
   */
  isVerified: boolean
  /**
   * @property {boolean} isNft - Indicates if the pfp image is a NFT
   */
  isNft: boolean
  /**
   * @property {Maybe<Array<string>>} blacklistIds - An array of user IDs that are blacklisted.
   */
  blacklistIds: Maybe<Array<string>>
  /**
   * @property {boolean} allowNotification - Indicates if notifications are allowed.
   */
  allowNotification: boolean
  /**
   * @property {boolean} allowNotificationSound - Indicates if notification sounds are allowed.
   */
  allowNotificationSound: boolean
  /**
   * @property {boolean} visibility - Indicates the visibility status of the user.
   */
  visibility: boolean
  /**
   * @property {Maybe<Array<string>>} archivedConversations - Array of archived conversations by this user.
   */
  archivedConversations: Maybe<Array<string>>
  /**
   * @property {Maybe<"ONLINE" | "OFFLINE" | "BUSY">} onlineStatus - The online status of the user.
   */
  onlineStatus: Maybe<"ONLINE" | "OFFLINE" | "BUSY">
  /**
   * @property {boolean} allowReadReceipt - Indicates if read receipts are allowed.
   */
  allowReadReceipt: boolean
  /**
   * @property {Maybe<"NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE">} allowReceiveMessageFrom - Indicates which group of users the current user is allowing to send messages
   */
  allowReceiveMessageFrom: Maybe<"NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE">
  /**
   * @property {Maybe<"ONLY_FOLLOWED" | "EVERYONE">} allowAddToGroupsFrom - Specifies the permission level required to add items to groups.
   */
  allowAddToGroupsFrom: Maybe<"ONLY_FOLLOWED" | "EVERYONE">
  /**
   * @property {boolean} allowGroupsSuggestion - A boolean flag indicating whether to allow group suggestions.
   */
  allowGroupsSuggestion: boolean
  /**
   * @property {Maybe<string>} e2ePublicKey - The public key of the user.
   */
  e2ePublicKey: Maybe<string>
  /**
   * @property {Maybe<string>} e2eSecret - The secret key of the user.
   */
  e2eSecret: Maybe<string>
  /**
   * @property {Maybe<string>} e2eSecretIV - The secret IV of the user.
   */
  e2eSecretIV: Maybe<string>
  /**
   * @property {Date} createdAt - Indicates the creation date
   */
  createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - Indicates the update date
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Client} client - Indicates the client
   */
  client: Client
}
