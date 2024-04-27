import { BlacklistUserEntrySchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { BlacklistUserEntryInitConfig } from "../../interfaces/chat/core/blacklistuserentry/blacklistuserentryinitconfig"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../interfaces/chat/core"

export class BlacklistUserEntry
  extends Engine
  implements BlacklistUserEntrySchema
{
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>

  constructor(config: BlacklistUserEntryInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })
    this.id = config.id
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this._client = config.client
  }

  async blockedUser(): Promise<any> {
    return 1
  }
}
