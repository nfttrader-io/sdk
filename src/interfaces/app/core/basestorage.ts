export interface BaseStorage {
  disableStorage(): void
  enableStorage(): void
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
  insertBulkSafe<T>(tableName: string, items: T[]): void
}
