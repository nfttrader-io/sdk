import { BaseStorage } from "../../interfaces/app"
import { CreateOrConnectIndexedDBArgs } from "../../types/app"

export class IndexedDBStorage implements BaseStorage {
  private _dbName: string
  private _dbVersion: number

  private constructor(dbName: string, dbVersion: number) {
    this._dbName = dbName
    this._dbVersion = dbVersion
  }

  private _applyFilter(item: any, filter: any): boolean {
    // Implement your filter logic here
    return true
  }

  private async _initDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this._dbName)

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  private async _getDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this._dbName)

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result)
      }
    })
  }

  static async createOrConnect(
    params: CreateOrConnectIndexedDBArgs
  ): Promise<IndexedDBStorage> {
    const instance = new IndexedDBStorage(params.dbName, params.dbVersion)
    await instance._initDB()

    return instance
  }

  async createStoreIfNotExists(newStoreName: string): Promise<void> {
    const currentDb = await this._getDB()
    const newVersion = currentDb.version + 1

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this._dbName, newVersion)

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = () => {
        this._dbVersion = newVersion
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result
        if (!db.objectStoreNames.contains(newStoreName)) {
          db.createObjectStore(newStoreName)
        }
      }
    })
  }

  async getItem(storeName: string, key: string): Promise<any> {
    const db = await this._getDB()

    return new Promise<any>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async setItem(storeName: string, key: string, value: any): Promise<void> {
    const db = await this._getDB()

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(value, key)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async removeItem(storeName: string, key: string): Promise<void> {
    const db = await this._getDB()

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async query(storeName: string, filter: any): Promise<any[]> {
    const db = await this._getDB()

    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.openCursor()
      const results: any[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          if (this._applyFilter(cursor.value, filter)) {
            results.push(cursor.value)
          }
          cursor.continue()
        } else {
          resolve(results)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  getDBName(): string {
    return this._dbName
  }

  getDBVersion(): number {
    return this._dbVersion
  }

  typeOf(): string {
    return this.constructor.name
  }
}
