import { BlacklistUserEntry } from "./blacklistuserentry"
import { UserSchema } from "../../interfaces/chat/schema"
import {
  UserQueryEngine,
  UserInitConfig,
} from "../../interfaces/chat/core/user"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../interfaces/chat/core/engineinitconfig"
import Maybe from "../../types/general/maybe"

export class User extends Engine implements UserSchema, UserQueryEngine {
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

  async blacklist(): Promise<BlacklistUserEntry[]> {
    return new Promise(() => {})
  }
}
