import { Maybe } from "../../../types/base"

/**
 * Represents the schema for a user object.
 * @interface UserSchema
 */
export interface UserSchema {
  /**
   * @property {string} id - The unique identifier of the user.
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
   * @property {boolean} isNft - Indicates if the pfp is a NFT.
   */
  isNft: boolean
  /**
   * @property {Maybe<Array<string>>} blacklistIds - An array of user IDs to blacklist.
   */
  blacklistIds: Maybe<Array<string>>
  /**
   * @property {boolean} allowNotification - Flag to allow notifications.
   */
  allowNotification: boolean
  /**
   * @property {boolean} allowNotificationSound - Flag to allow notification sounds.
   */
  allowNotificationSound: boolean
  /**
   * @property {boolean} visibility - Flag to set user's visibility.
   */
  visibility: boolean
  /**
   * @property {Maybe<Array<string>>} archivedConversations - Array of archived conversations by this user.
   */
  archivedConversations: Maybe<Array<string>>
  /**
   * @property {Maybe<"ONLINE" | "OFFLINE" | "BUSY">} onlineStatus - User's online status.
   */
  onlineStatus: Maybe<"ONLINE" | "OFFLINE" | "BUSY">
  /**
   * @property {boolean} allowReadReceipt - Flag to allow read receipts.
   */
  allowReadReceipt: boolean
  /**
   * @property {Maybe<"NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE">} allowReceiveMessageFrom - Indicates who can send messages to the user (NO_ONE, ONLY_FOLLOWED, EVERYONE).
   */
  allowReceiveMessageFrom: Maybe<"NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE">
  /**
   * @property {Maybe<"EVERYONE" | "ONLY_FOLLOWED">} allowAddToGroupsFrom - Specifies who can add the user to groups.
   */
  allowAddToGroupsFrom: Maybe<"EVERYONE" | "ONLY_FOLLOWED">
  /**
   * @property {boolean} allowGroupsSuggestion - Indicates whether group suggestions are allowed.
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
   * @property {Date} createdAt - The date when the user settings were created.
   */
  createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - The date when the user settings were last updated.
   */
  updatedAt: Maybe<Date>
}
