import { Client } from "@urql/core"
import { BlacklistUserEntry } from "../../interfaces/chat/blacklistuserentry"
import { User as IUser } from "../../interfaces/chat/user"

export interface UserInitConfig {
  id: string
  address: string
  username: string
  email: string
  bio: string
  avatarUrl: URL
  isVerified: boolean
  isNft: boolean
  blacklistIds: string[]
  allowNotification: boolean
  allowNotificationSound: boolean
  visibility: boolean
  onlineStatus: "ONLINE" | "OFFLINE" | "BUSY"
  allowReadReceipt: boolean
  allowReceiveMessageFrom: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  allowAddToGroupsFrom: "ONLY_FOLLOWED" | "EVERYONE"
  allowGroupsSuggestion: boolean
  encryptedPrivateKey: string
  publicKey: string
  createdAt: Date
  updatedAt: Date | null
  client: Client
}

export class User implements IUser {
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

  private _client: Client | null = null

  constructor(config: UserInitConfig) {
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
