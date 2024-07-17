import { IndexedDBStorage, RealmStorage } from "./core/app"
import {
  CLIENT_DB_NAME,
  CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME,
} from "./constants/app"
import { v4 as uuid } from "uuid"
import { Auth } from "./auth"
import { Chat } from "./chat"
import { Oracle } from "./oracle"
import { Post } from "./post"
import { Trade } from "./trade"
import { LoopzConfig } from "./types/app/loopzconfig"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { PrivyAdapter } from "./adapter"

export class Loopz {
  private static _instance: Loopz
  private static _randomLsname: string

  private static _auth: Auth
  private static _chat: Chat
  private static _oracle: Oracle
  private static _post: Post
  private static _trade: Trade

  private static _apiKey: string

  private static _privyAppId: string

  private static _privyClientConfig: PrivyClientConfig

  private static _storage: IndexedDBStorage | RealmStorage

  private static _privyAdapter: PrivyAdapter

  private constructor(config: LoopzConfig) {
    Loopz._apiKey = config.apiKey
    Loopz._privyAppId = config.privyAppId
    Loopz._privyClientConfig = config.privyClientConfig
    Loopz._storage = config.storage
    Loopz._randomLsname = `loopz_${uuid()}`

    Loopz._privyAdapter = new PrivyAdapter({
      appId: config.privyAppId,
      device: typeof window !== "undefined" ? "desktop" : "mobile",
      desktopOptions:
        typeof window === "undefined" ? undefined : config.privyClientConfig,
      mobileOptions: typeof window !== "undefined" ? undefined : {},
    })

    Loopz._auth = new Auth({
      apiKey: config.apiKey,
      privyAppId: config.privyAppId,
      privyConfig: config.privyClientConfig,
      storage: config.storage,
    })
    Loopz._oracle = new Oracle({
      apiKey: config.apiKey,
    })
    Loopz._post = new Post({
      apiKey: config.apiKey,
    })
    Loopz._trade = new Trade({
      apiKey: config.apiKey,
    })

    Loopz._privyAdapter.render(Loopz._auth, Loopz._trade)
  }

  private static async createOrConnectToStorage(): Promise<
    IndexedDBStorage | RealmStorage
  > {
    if (
      typeof window !== "undefined" &&
      typeof window.indexedDB !== "undefined"
    ) {
      if (!window.localStorage)
        throw new Error(
          "localStorage is not supported. Use a browser that provides the window.localStorage feature."
        )

      try {
        localStorage.setItem(Loopz._randomLsname, "")
        localStorage.removeItem(Loopz._randomLsname)
      } catch (error) {
        throw new Error(
          "localStorage is not supported. Use a browser that provides the window.localStorage feature."
        )
      }

      const DB_VERSION = localStorage.getItem(
        CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME
      )

      try {
        return IndexedDBStorage.createOrConnect({
          dbName: CLIENT_DB_NAME,
          dbVersion: DB_VERSION ? Number(DB_VERSION) : 0,
        })
      } catch (error) {
        console.log(error)
        throw new Error(
          "Error during the creation of the local database. See the console for more info."
        )
      }
    } else {
      return RealmStorage.createOrConnect()
    }
  }

  static async boot(config: Omit<LoopzConfig, "storage">): Promise<Loopz> {
    if (!Loopz._instance) {
      const storage = await Loopz.createOrConnectToStorage()
      Loopz._instance = new Loopz({
        ...config,
        storage,
      })
    }

    return Loopz._instance
  }

  init(): { auth: Auth; trade: Trade; post: Post; oracle: Oracle } {
    return {
      auth: Loopz._auth,
      trade: Loopz._trade,
      post: Loopz._post,
      oracle: Loopz._oracle,
    }
  }

  initChat(authToken: string, apiUrl: string, realtimeApiUrl: string): Chat {
    Loopz._chat = new Chat({
      apiKey: Loopz._apiKey,
      apiUrl,
      realtimeApiUrl,
      jwtToken: authToken,
      keyPairsMap: [],
      userKeyPair: [],
    })

    return Loopz._chat
  }
}
