import { IndexedDBStorage, RealmStorage } from "./core/app"
import { IStorage } from "./interfaces/app"

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
      return IndexedDBStorage.create("myDatabase", "myStore")
    } else {
      return RealmStorage.create()
    }
  }

  public getStorage(): IStorage {
    return this._storage
  }
}
