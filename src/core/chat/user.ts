import { BlacklistUserEntry } from "./blacklistuserentry"
import { User as IUser } from "../../interfaces/chat/user"
import { UserEngine } from "../../interfaces/chat/core/userengine"
import { UserInitConfig } from "../../interfaces/chat/userinitconfig"
import { QIError } from "./qierror"
import { QueryEngine } from "./queryengine"
import { QueryEngineInitConfig } from "../../interfaces/chat/core/queryengineinitconfig"

export class User extends QueryEngine implements IUser, UserEngine {
  readonly id: string
  readonly address: string
  readonly username: string
  readonly email: string
  readonly bio: string
  readonly avatarUrl: URL
  readonly isVerified: boolean
  readonly isNft: boolean
  readonly blacklistIds: string[]
  readonly allowNotification: boolean
  readonly allowNotificationSound: boolean
  readonly visibility: boolean
  readonly onlineStatus: "ONLINE" | "OFFLINE" | "BUSY"
  readonly allowReadReceipt: boolean
  readonly allowReceiveMessageFrom: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  readonly allowAddToGroupsFrom: "ONLY_FOLLOWED" | "EVERYONE"
  readonly allowGroupsSuggestion: boolean
  readonly encryptedPrivateKey: string
  readonly publicKey: string
  readonly createdAt: Date
  readonly updatedAt: Date | null

  constructor(config: UserInitConfig & QueryEngineInitConfig) {
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

  async blockUser(): Promise<User | QIError> {
    return new Promise(() => {})
  }

  async blacklist(): Promise<BlacklistUserEntry[]> {
    return new Promise(() => {})
  }
}
