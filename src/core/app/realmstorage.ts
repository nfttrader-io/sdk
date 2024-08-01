import { BaseStorage } from "../../interfaces/app"
import * as Realm from "realm"
import { Maybe } from "../../types"

export class RealmStorage implements BaseStorage {
  private realm: Maybe<Realm>

  private constructor() {
    this.realm = null
  }

  static async createOrConnect(): Promise<RealmStorage> {
    return new RealmStorage()
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
}
