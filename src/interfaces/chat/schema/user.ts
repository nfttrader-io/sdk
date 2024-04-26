import Maybe from "../../../types/general/maybe"

export interface UserSchema {
  id: string
  address: string
  username: Maybe<string>
  email: Maybe<string>
  bio: Maybe<string>
  avatarUrl: Maybe<URL>
  isVerified: boolean
  isNft: boolean
  //blacklist -> the implementation of blacklist is defined in the interface UserEngine
  blacklistIds: Maybe<Array<Maybe<string>>>
  allowNotification: boolean
  allowNotificationSound: boolean
  visibility: boolean
  onlineStatus: Maybe<"ONLINE" | "OFFLINE" | "BUSY">
  allowReadReceipt: boolean
  allowReceiveMessageFrom: Maybe<"NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE">
  allowAddToGroupsFrom: Maybe<"EVERYONE" | "ONLY_FOLLOWED">
  allowGroupsSuggestion: boolean
  encryptedPrivateKey: Maybe<string>
  publicKey: Maybe<string>
  createdAt: Date
  updatedAt: Maybe<Date>
}
