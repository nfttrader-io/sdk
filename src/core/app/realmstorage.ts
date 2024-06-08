import { IStorage } from "../../interfaces/app"
import * as Realm from "realm"
import { Maybe } from "../../types"

export class RealmStorage implements IStorage {
  private realm: Maybe<Realm>

  private constructor() {
    this.realm = null
  }

  static async create(): Promise<IStorage> {
    return new RealmStorage()
  }

  public async getItem(key: string): Promise<any> {}

  public async setItem(key: string, value: any): Promise<void> {}

  public async removeItem(key: string): Promise<void> {}

  public async query(filter: any): Promise<any[]> {
    return new Promise(() => {})
  }
}
