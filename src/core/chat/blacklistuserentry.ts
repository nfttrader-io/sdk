import { BlacklistUserEntrySchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { BlacklistUserEntryInitConfig } from "../../interfaces/chat/core/blacklistuserentry"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../interfaces/chat/core"
import { User } from "./user"

export class BlacklistUserEntry
  extends Engine
  implements BlacklistUserEntrySchema
{
  readonly id: string
  readonly createdAt: Date
  readonly blockerId: string
  readonly blockedId: string
  readonly blockedUser: Maybe<User>

  constructor(config: BlacklistUserEntryInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      e2e: config.e2e,
    })
    this.id = config.id
    this.createdAt = config.createdAt
    this.blockerId = config.blockerId
    this.blockedId = config.blockedId
    this.blockedUser = config.blockedUser
    this._client = config.client
  }
}
