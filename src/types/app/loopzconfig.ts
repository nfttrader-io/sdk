import { PrivyClientConfig } from "@privy-io/react-auth"
import { IndexedDBStorage, RealmStorage } from "@src/core/app"

export type LoopzConfig = {
  apiKey: string
  privyAppId: string
  privyClientConfig: PrivyClientConfig
  storage: IndexedDBStorage | RealmStorage
}
