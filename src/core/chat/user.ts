import { BlacklistUserEntry } from "./blacklistuserentry"
import { UserSchema } from "../../interfaces/chat/schema"
import {
  UserQueryEngine,
  UserMutationEngine,
} from "../../interfaces/chat/core/user"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../interfaces/chat/core/engineinitconfig"
import { Maybe } from "../../types/base"
import { QIError } from "./qierror"
import {
  MutationAddBlockedUserArgs,
  MutationRemoveBlockedUserArgs,
  User as UserGraphQL,
} from "../../graphql/generated/graphql"
import {
  addBlockedUser,
  removeBlockedUser,
} from "../../constants/chat/mutations"
import { getCurrentUserWithBlacklist } from "../../constants/chat/queries"
import { UserInitConfig } from "../../types/chat/core/user"

/**
 * Represents a User class that extends Engine and implements UserSchema, UserQueryEngine, and UserMutationEngine interfaces.
 * @class User
 * @extends Engine
 * @implements UserSchema, UserQueryEngine, UserMutationEngine
 */

export class User
  extends Engine
  implements UserSchema, UserQueryEngine, UserMutationEngine
{
  /**
   * @property id - The unique identifier of the user.
   */
  readonly id: string
  /**
   * @property address - The address of the user.
   */
  readonly address: string
  /**
   * @property username - The username of the user, if available.
   */
  readonly username: Maybe<string>
  /**
   * @property email - The email address of the user, if available.
   */
  readonly email: Maybe<string>
  /**
   * @property bio - The biography of the user, if available.
   */
  readonly bio: Maybe<string>
  /**
   * @property avatarUrl - The URL of the user's avatar, if available.
   */
  readonly avatarUrl: Maybe<URL>
  /**
   * @property isVerified - Indicates if the user is verified.
   */
  readonly isVerified: boolean
  /**
   * @property isNft - Indicates if the user is associated with NFTs.
   */
  readonly isNft: boolean
  /**
   * @property blacklistIds - An array of user IDs that are blacklisted by this user.
   */
  readonly blacklistIds: Maybe<Array<Maybe<string>>>
  /**
   * @property allowNotification - Indicates if notification are allowed.
   */
  readonly allowNotification: boolean
  /**
   * @property allowNotificationSound - Indicates if notification sounds are allowed.
   */
  readonly allowNotificationSound: boolean
  /**
   * @property visibility - Indicates the visibility status of the user.
   */
  readonly visibility: boolean
  /**
   * @property onlineStatus - Indicates the online status of the user (ONLINE, OFFLINE, BUSY).
   */
  readonly onlineStatus: Maybe<"ONLINE" | "OFFLINE" | "BUSY">
  /**
   * @property allowReadReceipt - Indicates if read receipts are allowed.
   */
  readonly allowReadReceipt: boolean
  /**
   * @property allowReceiveMessageFrom - Indicates who can send messages to the user (NO_ONE, ONLY_FOLLOWED, EVERYONE).
   */
  readonly allowReceiveMessageFrom: Maybe<
    "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  >
  /**
   * @readonly allowAddToGroupsFrom - Indicates who can add the user to groups (ONLY_FOLLOWED, EVERYONE).
   */
  readonly allowAddToGroupsFrom: Maybe<"ONLY_FOLLOWED" | "EVERYONE">
  /**
   * @readonly allowGroupsSuggestion - Indicates if the groups suggestion is allowed
   */
  readonly allowGroupsSuggestion: boolean
  /**
   * @readonly encryptedPrivateKey - The encrypted private key.
   */
  readonly encryptedPrivateKey: Maybe<string>
  /**
   * @readonly publicKey - The public key.
   */
  readonly publicKey: Maybe<string>
  /**
   * @readonly encryptedSecret - The secret key.
   */
  readonly encryptedSecret: Maybe<string>
  /**
   *  @readonly createdAt - The creation date of the key pair.
   */
  readonly createdAt: Date
  /**
   * @readonly updatedAt - The optional date of the last update to the key pair.
   */
  readonly updatedAt: Maybe<Date>

  /**
   * Constructor for creating a new instance of a user with the provided configuration.
   * @param {UserInitConfig & EngineInitConfig} config - The configuration object containing user and engine initialization settings.
   * @returns None
   */
  constructor(config: UserInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })

    this.id = config.id
    this.address = config.address
    this.username = config.username
    this.email = config.email
    this.bio = config.bio
    this.avatarUrl = config.avatarUrl
    this.isVerified = config.isVerified
    this.isNft = config.isNft
    this.blacklistIds = config.blacklistIds
    this.allowNotification = config.allowNotification
    this.allowNotificationSound = config.allowNotificationSound
    this.visibility = config.visibility
    this.onlineStatus = config.onlineStatus
    this.allowReadReceipt = config.allowReadReceipt
    this.allowReceiveMessageFrom = config.allowReceiveMessageFrom
    this.allowAddToGroupsFrom = config.allowAddToGroupsFrom
    this.allowGroupsSuggestion = config.allowGroupsSuggestion
    this.encryptedPrivateKey = config.encryptedPrivateKey
    this.publicKey = config.publicKey
    this.encryptedSecret = config.encryptedSecret
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt

    this._client = config.client
  }

  /**
   * Blocks a user by adding them to the blocked users list.
   * If id is provided, it throws an error.
   * @returns {Promise<User | QIError>} A promise that resolves to the blocked user or an error.
   */
  async blockUser(): Promise<User | QIError>
  async blockUser(id: string): Promise<User | QIError>
  async blockUser(id?: unknown): Promise<User | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use blockUser() instead."
      )

    const response = await this._mutation<
      MutationAddBlockedUserArgs,
      { addBlockedUser: UserGraphQL },
      UserGraphQL
    >("addBlockedUser", addBlockedUser, "_mutation() -> blockUser()", {
      blockId: this.id,
    })

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isNft: response.isNft ? response.isNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      encryptedPrivateKey: response.encryptedPrivateKey
        ? response.encryptedPrivateKey
        : null,
      publicKey: response.publicKey ? response.publicKey : null,
      encryptedSecret: response.encryptedSecret
        ? response.encryptedSecret
        : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  /**
   * Asynchronously unlocks the current user represented by this object.
   * If id is provided, it throws an error indicating that the id argument cannot be defined.
   * @returns {Promise<User | QIError>} A promise that resolves to a User object if successful, or a QIError object if there was an error.
   */
  async unlockUser(): Promise<User | QIError>
  async unlockUser(id: string): Promise<User | QIError>
  async unlockUser(id?: unknown): Promise<User | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use blockUser() instead."
      )

    const response = await this._mutation<
      MutationRemoveBlockedUserArgs,
      { removeBlockedUser: UserGraphQL },
      UserGraphQL
    >("removeBlockedUser", removeBlockedUser, "_mutation() -> unlockUser()", {
      blockId: this.id,
    })

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isNft: response.isNft ? response.isNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      encryptedPrivateKey: response.encryptedPrivateKey
        ? response.encryptedPrivateKey
        : null,
      publicKey: response.publicKey ? response.publicKey : null,
      encryptedSecret: response.encryptedSecret
        ? response.encryptedSecret
        : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  /**
   * Retrieves the blacklist of the current user, including details of blocked users.
   * @returns {Promise<BlacklistUserEntry[] | QIError>} - A promise that resolves to an array of BlacklistUserEntry objects if successful, or a QIError object if there was an error.
   */
  async blacklist(): Promise<BlacklistUserEntry[] | QIError> {
    const response = await this._query<
      null,
      {
        getCurrentUser: UserGraphQL
      },
      UserGraphQL
    >(
      "getCurrentUser",
      getCurrentUserWithBlacklist,
      "_query() -> blacklist()",
      null
    )

    if (response instanceof QIError) return response

    const blacklist: Array<BlacklistUserEntry> = []

    response.blacklist?.forEach((item) => {
      if (item && item.blockedUser) {
        blacklist.push(
          new BlacklistUserEntry({
            ...this._parentConfig!,
            id: item.id,
            blockerId: item.blockerId,
            blockedId: item.blockedId,
            blockedUser: new User({
              ...this._parentConfig!,
              id: item.blockedUser.id,
              username: item.blockedUser.username
                ? item.blockedUser.username
                : null,
              address: item.blockedUser.address,
              email: item.blockedUser.email ? item.blockedUser.email : null,
              bio: item.blockedUser.bio ? item.blockedUser.bio : null,
              avatarUrl: item.blockedUser.avatarUrl
                ? new URL(item.blockedUser.avatarUrl)
                : null,
              isVerified: item.blockedUser.isVerified
                ? item.blockedUser.isVerified
                : false,
              isNft: item.blockedUser.isNft ? item.blockedUser.isNft : false,
              blacklistIds: item.blockedUser.blacklistIds
                ? item.blockedUser.blacklistIds
                : null,
              allowNotification: item.blockedUser.allowNotification
                ? item.blockedUser.allowNotification
                : false,
              allowNotificationSound: item.blockedUser.allowNotificationSound
                ? item.blockedUser.allowNotificationSound
                : false,
              visibility: item.blockedUser.visibility
                ? item.blockedUser.visibility
                : false,
              onlineStatus: item.blockedUser.onlineStatus
                ? item.blockedUser.onlineStatus
                : null,
              allowReadReceipt: item.blockedUser.allowReadReceipt
                ? item.blockedUser.allowReadReceipt
                : false,
              allowReceiveMessageFrom: item.blockedUser.allowReceiveMessageFrom
                ? item.blockedUser.allowReceiveMessageFrom
                : null,
              allowAddToGroupsFrom: item.blockedUser.allowAddToGroupsFrom
                ? item.blockedUser.allowAddToGroupsFrom
                : null,
              allowGroupsSuggestion: item.blockedUser.allowGroupsSuggestion
                ? item.blockedUser.allowGroupsSuggestion
                : false,
              encryptedPrivateKey: item.blockedUser.encryptedPrivateKey
                ? item.blockedUser.encryptedPrivateKey
                : null,
              publicKey: item.blockedUser.publicKey
                ? item.blockedUser.publicKey
                : null,
              encryptedSecret: item.blockedUser.encryptedSecret
                ? item.blockedUser.encryptedSecret
                : null,
              createdAt: new Date(item.blockedUser.createdAt),
              updatedAt: item.blockedUser.updatedAt
                ? new Date(item.blockedUser.updatedAt)
                : null,
              client: this._client!,
            }),
            createdAt: item.createdAt,
            client: this._client!,
          })
        )
      }
    })

    return blacklist
  }
}
