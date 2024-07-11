import { PrivyClientConfig } from "@privy-io/react-auth"
import { IndexedDBStorage, RealmStorage } from "../../core/app"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  storage?: IndexedDBStorage | RealmStorage
  privyAppId: string
  privyConfig: PrivyClientConfig
}
