import { BaseStorage } from "../../interfaces/app"
import * as Realm from "realm"
import { Maybe } from "../../types"

export class RealmStorage implements BaseStorage {
  private realm: Maybe<Realm>
  private _enableStorage = true

  private constructor() {
    this.realm = null
  }

  static async createOrConnect(): Promise<RealmStorage> {
    return new RealmStorage()
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

  async deleteBulk(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "conversationSystemMessage",
    ids: string[]
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async query(): Promise<void> {
    if (!this._enableStorage) return
  }

  async insertBulkSafe<T>(tableName: string, items: T[]): Promise<void> {
    throw new Error("Method not implemented.")
  }

  disableStorage(): void {
    this._enableStorage = false
  }

  enableStorage(): void {
    this._enableStorage = true
  }

  getDBName(): string {
    throw new Error("Method not implemented.")
  }

  getDBVersion(): number {
    throw new Error("Method not implemented.")
  }

  typeOf(): string {
    return this.constructor.name
  }

  isStorageEnabled(): boolean {
    return this._enableStorage === true
  }

  getTable<T>(
    tableName: "user" | "conversation" | "message" | "conversationSystemMessage"
  ) {
    return "" as T
  }

  truncate(tableName: "user" | "conversation" | "message"): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
