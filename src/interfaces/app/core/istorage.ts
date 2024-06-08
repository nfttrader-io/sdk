export interface IStorage {
  getItem(key: string): Promise<any>
  setItem(key: string, value: any): Promise<void>
  removeItem(key: string): Promise<void>
  query(filter: any): Promise<any[]>
}
