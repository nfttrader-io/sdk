import Dexie from "dexie"

export interface BaseStorage {
  disableStorage(): void
  enableStorage(): void
  isStorageEnabled(): boolean
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
  insertBulkSafe<T>(tableName: string, items: T[]): void
  get(tableName: string, key: string, value: string): Promise<any>
  getTable<T>(tableName: "user" | "conversation" | "message"): T
}
