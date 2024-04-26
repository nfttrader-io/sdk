import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface UserInitConfig {
  id: string
  address: string
  username: Maybe<string>
  email: Maybe<string>
  bio: Maybe<string>
  avatarUrl: Maybe<URL>
  isVerified: boolean
  isNft: boolean
  blacklistIds: Maybe<Array<Maybe<string>>>
  allowNotification: boolean
  allowNotificationSound: boolean
  visibility: boolean
  onlineStatus: Maybe<"ONLINE" | "OFFLINE" | "BUSY">
  allowReadReceipt: boolean
  allowReceiveMessageFrom: Maybe<"NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE">
  allowAddToGroupsFrom: Maybe<"ONLY_FOLLOWED" | "EVERYONE">
  allowGroupsSuggestion: boolean
  encryptedPrivateKey: Maybe<string>
  publicKey: Maybe<string>
  createdAt: Date
  updatedAt: Maybe<Date>
  client: Client
}
