import { BlacklistUserEntrySchema } from "../../interfaces/chat/schema"
import { Maybe } from "../../types/base"
import { BlacklistUserEntryInitConfig } from "../../interfaces/chat/core/blacklistuserentry"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../interfaces/chat/core"
import { User } from "./user"

/**
 * Represents a Represents a relationship between a blocker and a blocked user. BlacklistUserEntry extends the Engine class and implements the BlacklistUserEntrySchema.
 * @class BlacklistUserEntry
 * @extends Engine
 * @implements BlacklistUserEntrySchema
 */

export class BlacklistUserEntry
  extends Engine
  implements BlacklistUserEntrySchema
{
  /**
   * @property id - The unique identifier of the relationship.
   */
  readonly id: string
  /**
   * @property createdAt - The date and time when the relationship was created.
   */
  readonly createdAt: Date
  /**
   * @property blockerId - The unique identifier of the user who is blocking.
   */
  readonly blockerId: string
  /**
   * @property blockedId - The unique identifier of the user who is blocked.
   */
  readonly blockedId: string
  /**
   * @property blockedUser - The user who is blocked, wrapped in a Maybe monad.
   */
  readonly blockedUser: Maybe<User>

  /**
   * Constructs a new instance of BlacklistUserEntry with the provided configuration.
   * @param {BlacklistUserEntryInitConfig & EngineInitConfig} config - The configuration object containing
   *   jwtToken, apiKey, apiUrl, realtimeApiUrl, userKeyPair, keyPairsMap, id, createdAt, blockerId, blockedId,
   *   blockedUser, and client.
   * @returns None
   */
  constructor(config: BlacklistUserEntryInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })
    this.id = config.id
    this.createdAt = config.createdAt
    this.blockerId = config.blockerId
    this.blockedId = config.blockedId
    this.blockedUser = config.blockedUser
    this._client = config.client
  }
}
