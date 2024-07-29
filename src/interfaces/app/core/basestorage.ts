export interface BaseStorage {
  get(storeName: string, key: string): Promise<any>
  insert(storeName: string, key: string, value: any): Promise<void>
  delete(storeName: string, key: string): Promise<void>
  query(storeName: string, filter: any): Promise<any[]>
  insertSafe(storeName: string, key: string, value: any): Promise<void>
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
}
