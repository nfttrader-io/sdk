import { BlacklistUserEntry } from "./blacklistuserentry"
import { UserSchema } from "../../interfaces/chat/schema"
import {
  UserQueryEngine,
  UserInitConfig,
  UserMutationEngine,
} from "../../interfaces/chat/core/user"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../interfaces/chat/core/engineinitconfig"
import Maybe from "../../types/general/maybe"
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

export class User
  extends Engine
  implements UserSchema, UserQueryEngine, UserMutationEngine
{
  readonly id: string
  readonly address: string
  readonly username: Maybe<string>
  readonly email: Maybe<string>
  readonly bio: Maybe<string>
  readonly avatarUrl: Maybe<URL>
  readonly isVerified: boolean
  readonly isNft: boolean
  readonly blacklistIds: Maybe<Array<Maybe<string>>>
  readonly allowNotification: boolean
  readonly allowNotificationSound: boolean
  readonly visibility: boolean
  readonly onlineStatus: Maybe<"ONLINE" | "OFFLINE" | "BUSY">
  readonly allowReadReceipt: boolean
  readonly allowReceiveMessageFrom: Maybe<
    "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  >
  readonly allowAddToGroupsFrom: Maybe<"ONLY_FOLLOWED" | "EVERYONE">
  readonly allowGroupsSuggestion: boolean
  readonly encryptedPrivateKey: Maybe<string>
  readonly publicKey: Maybe<string>
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>

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
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt

    this._client = config.client
  }

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
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

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
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

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
