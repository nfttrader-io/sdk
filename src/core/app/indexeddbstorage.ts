import { IStorage } from "../../interfaces/app"

export class IndexedDBStorage implements IStorage {
  private _dbName: string
  private _storeName: string

  private constructor(dbName: string, storeName: string) {
    this._dbName = dbName
    this._storeName = storeName
  }

  static async create(dbName: string, storeName: string): Promise<IStorage> {
    const instance = new IndexedDBStorage(dbName, storeName)
    await instance.initDB()
    return instance
  }

  private async initDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this._dbName)

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error)
      }

      request.onsuccess = () => {
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result
        if (!db.objectStoreNames.contains(this._storeName)) {
          db.createObjectStore(this._storeName)
        }
      }
    })
  }

  private async getDB() {
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

  public async getItem(key: string): Promise<any> {
    const db = await this.getDB()
    return new Promise<any>((resolve, reject) => {
      const transaction = db.transaction(this._storeName, "readonly")
      const store = transaction.objectStore(this._storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public async setItem(key: string, value: any): Promise<void> {
    const db = await this.getDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this._storeName, "readwrite")
      const store = transaction.objectStore(this._storeName)
      const request = store.put(value, key)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public async removeItem(key: string): Promise<void> {
    const db = await this.getDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this._storeName, "readwrite")
      const store = transaction.objectStore(this._storeName)
      const request = store.delete(key)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public async query(filter: any): Promise<any[]> {
    const db = await this.getDB()
    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(this._storeName, "readonly")
      const store = transaction.objectStore(this._storeName)
      const request = store.openCursor()
      const results: any[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          if (this.applyFilter(cursor.value, filter)) {
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

  private applyFilter(item: any, filter: any): boolean {
    // Implement your filter logic here
    return true
  }
}
