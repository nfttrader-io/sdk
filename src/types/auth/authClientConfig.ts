import { Maybe } from "../../types/base"
import { DexieStorage, RealmStorage } from "../../core/app"

/**
 * Represents the configuration options for an authentication client.
 */
export type AuthClientConfig = {
  storage?: Maybe<DexieStorage | RealmStorage>
}
