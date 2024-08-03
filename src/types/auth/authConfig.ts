import { PrivyClientConfig } from "@privy-io/react-auth"
import { DexieStorage, RealmStorage } from "../../core/app"
import { Oracle } from "@src/oracle"
import { Trade } from "@src/trade"
import { Post } from "@src/post"
import { Chat } from "@src/chat"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  storage: DexieStorage | RealmStorage
  oracle: Oracle
  trade: Trade
  post: Post
  chat: Chat
  privyAppId: string
  privyConfig: PrivyClientConfig
}
