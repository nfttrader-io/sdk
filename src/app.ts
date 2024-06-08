import { IndexedDBStorage, RealmStorage } from "./core/app"
import { IStorage } from "./interfaces/app"
import { CLIENT_DB_NAME } from "./constants/app"

export class App {
  private static _instance: App
  private _storage: IStorage

  private constructor(storage: IStorage) {
    this._storage = storage
  }

  public static async getInstance(): Promise<App> {
    if (!App._instance) {
      const storage = await App.createStorage()
      App._instance = new App(storage)
    }
    return App._instance
  }

  private static async createStorage(): Promise<IStorage> {
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
        return IndexedDBStorage.create(
          CLIENT_DB_NAME,
          DB_VERSION ? Number(DB_VERSION) : 0
        )
      } catch (error) {
        throw new Error(
          "localStorage is not supported. Use a browser that provides the window.localStorage feature."
        )
      }
    } else {
      return RealmStorage.create()
    }
  }

  public getStorage(): IStorage {
    return this._storage
  }
}
