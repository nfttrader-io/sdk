import { Client } from "@urql/core"

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
