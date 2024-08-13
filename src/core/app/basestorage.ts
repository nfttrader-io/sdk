export interface BaseStorage {
  disableStorage(): void
  enableStorage(): void
  isStorageEnabled(): boolean
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
  insertBulkSafe<T>(
    tableName: "user" | "conversation" | "message",
    items: T[]
  ): Promise<void>
  deleteItem(
    tableName: "user" | "conversation" | "message",
    key: string,
    value: string | string[]
  ): Promise<void>
  deleteBulk(
    tableName: "user" | "conversation" | "message",
    ids: string[]
  ): Promise<void>
  get(
    tableName: "user" | "conversation" | "message",
    key: string,
    value: string
  ): Promise<any>
  getTable<T>(tableName: "user" | "conversation" | "message"): T
  truncate(tableName: "user" | "conversation" | "message"): Promise<void>
}
