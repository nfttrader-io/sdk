import { PrivyClientConfig } from "@privy-io/react-auth"
import { IndexedDBStorage, RealmStorage } from "../../core/app"
import { Oracle } from "@src/oracle"
import { Trade } from "@src/trade"
import { Post } from "@src/post"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  storage?: IndexedDBStorage | RealmStorage
  oracle: Oracle
  trade: Trade
  post: Post
  privyAppId: string
  privyConfig: PrivyClientConfig
}
