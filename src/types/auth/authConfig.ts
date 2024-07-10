import { IndexedDBStorage, RealmStorage } from "../../core/app"
import { PrivyAppearanceOptions } from "./privyappearanceoptions"
import { PrivyExternalWalletsOptions } from "./privyexternalwalletsoptions"
import { PrivyLoginOptions } from "./privyloginoptions"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  storage: IndexedDBStorage | RealmStorage
  privyAppearanceOptions: PrivyAppearanceOptions
  privyLoginOptions: PrivyLoginOptions
  privyExternalWalletsOptions: PrivyExternalWalletsOptions
}
