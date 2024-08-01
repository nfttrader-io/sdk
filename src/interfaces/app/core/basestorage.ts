export interface BaseStorage {
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
}
