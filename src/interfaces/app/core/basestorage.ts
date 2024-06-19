export interface BaseStorage {
  getItem(storeName: string, key: string): Promise<any>
  setItem(storeName: string, key: string, value: any): Promise<void>
  removeItem(storeName: string, key: string): Promise<void>
  query(storeName: string, filter: any): Promise<any[]>
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
}
