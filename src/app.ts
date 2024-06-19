import { IndexedDBStorage, RealmStorage } from "./core/app"
import { BaseStorage } from "./interfaces/app"
import { CLIENT_DB_NAME } from "./constants/app"

export class App {
  private static _instance: App
  private _storage: BaseStorage

  private constructor(storage: BaseStorage) {
    this._storage = storage
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
        localStorage.setItem("sdk_nfttrader_try", "")
        localStorage.removeItem("sdk_nfttrader_try")
      } catch (error) {
        throw new Error(
          "localStorage is not supported. Use a browser that provides the window.localStorage feature."
        )
      }

      const DB_VERSION = localStorage.getItem("nfttrader_client_db_version")

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

  static async getInstance(): Promise<App> {
    if (!App._instance) {
      const storage = await App.createOrConnectToStorage()
      App._instance = new App(storage)
    }

    return App._instance
  }

  getStorage(): BaseStorage {
    return this._storage
  }
}
