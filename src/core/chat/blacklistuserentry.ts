import { Client } from "@urql/core"
import { BlacklistUserEntry as IBlacklistUserEntry } from "../../interfaces/chat/blacklistuserentry"
import { User } from "./user"

export interface BlacklistUserEntryInitConfig {
  id: string
  createdAt: Date
  updatedAt: Date | null
  client: Client
}

export class BlacklistUserEntry implements IBlacklistUserEntry {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date | null

  private _client: Client | null = null

  constructor(config: BlacklistUserEntryInitConfig) {
    this.id = config.id
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this._client = config.client
  }

  async blockedUser(): Promise<any> {
    return 1
  }
}
