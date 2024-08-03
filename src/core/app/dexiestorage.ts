import {
  WebConversation,
  WebMessage,
  WebUser,
} from "@src/interfaces/app/core/database"
import { BaseStorage } from "../../interfaces/app"
import { CreateOrConnectDexieArgs } from "../../types/app"
import Dexie from "dexie"

export class DexieStorage extends Dexie implements BaseStorage {
  //db info
  private _dbName: string
  private _dbVersion: number
  private _enableStorage: boolean = true

  //tables
  migration!: Dexie.Table<{ key: string; value: any }, string>
  user!: Dexie.Table<WebUser, string>
  message!: Dexie.Table<WebMessage, string>
  conversation!: Dexie.Table<WebConversation, string>

  private constructor(dbName: string, dbVersion: number) {
    super(dbName)

    this._dbName = dbName
    this._dbVersion = dbVersion

    this.version(this._dbVersion).stores({
      user: "++id, did, organizationId",
      conversation: "++id, name, description",
      message: "++id, content",
      migration: "key",
    })

    //let's store the current version of the database
    this.on("ready", async () => {
      const dbVersion = (await this.migration.get("dbVersion"))?.value
      if (dbVersion !== this._dbVersion)
        await this.migration.put({ key: "dbVersion", value: this._dbVersion })
    })
  }

  static async createOrConnect(
    params: CreateOrConnectDexieArgs
  ): Promise<DexieStorage> {
    const instance = new DexieStorage(params.dbName, params.dbVersion)

    return instance
  }

  async get(): Promise<any> {
    if (!this._enableStorage) return
  }

  async insert(): Promise<void> {
    if (!this._enableStorage) return
  }

  async insertSafe(): Promise<void> {
    if (!this._enableStorage) return
  }

  async deleteItem(): Promise<void> {
    if (!this._enableStorage) return
  }

  async query(): Promise<void> {
    if (!this._enableStorage) return
  }

  async insertBulkSafe<T>(tableName: string, items: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transaction("rw", tableName, async () => {
        if (tableName === "conversation")
          await this.conversation.bulkPut(items as WebConversation[])
        else if (tableName === "user")
          await this.user.bulkPut(items as WebUser[])
        else if (tableName === "message")
          await this.message.bulkPut(items as WebMessage[])

        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  disableStorage(): void {
    this._enableStorage = false
  }

  enableStorage(): void {
    this._enableStorage = true
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
