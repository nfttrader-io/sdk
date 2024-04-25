import { Client } from "@urql/core"
import { BlacklistUserEntrySchema } from "../../interfaces/chat/schema"

export interface BlacklistUserEntryInitConfig {
  id: string
  createdAt: Date
  updatedAt: Date | null
  client: Client
}

export class BlacklistUserEntry implements BlacklistUserEntrySchema {
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
