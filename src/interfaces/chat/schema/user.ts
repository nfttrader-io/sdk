export interface UserSchema {
  id: string
  address: string
  username: string
  email: string
  bio: string
  avatarUrl: URL
  isVerified: boolean
  isNft: boolean
  //blacklist -> the implementation of blacklist is defined in the interface UserEngine
  blacklistIds: Array<string>
  allowNotification: boolean
  allowNotificationSound: boolean
  visibility: boolean
  onlineStatus: "ONLINE" | "OFFLINE" | "BUSY"
  allowReadReceipt: boolean
  allowReceiveMessageFrom: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  allowAddToGroupsFrom: "EVERYONE" | "ONLY_FOLLOWED"
  allowGroupsSuggestion: boolean
  encryptedPrivateKey: string
  publicKey: string
  createdAt: Date
  updatedAt: Date | null
}
