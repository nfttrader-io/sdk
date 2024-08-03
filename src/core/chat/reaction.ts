import { ReactionInitConfig } from "../../types/chat/core/reaction"
import { ReactionSchema } from "../../interfaces/chat/schema/reaction"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../types"

/**
 * Represents a Reaction object that extends the Engine class and implements the ReactionSchema interface.
 * @class Reaction
 * @extends Engine
 * @implements ReactionSchema
 */

export class Reaction extends Engine implements ReactionSchema {
  /**
   * @property content - The content of the item.
   */
  readonly content: string
  /**
   * @property createdAt - The date and time when the item was created.
   */
  readonly createdAt: Date
  /**
   * @property userId - The unique identifier of the user who created the item.
   */
  readonly userId: string

  constructor(config: ReactionInitConfig & EngineInitConfig) {
    super({
      apiKey: config.apiKey,
      storage: config.storage,
    })
    this.content = config.content
    this.createdAt = config.createdAt
    this.userId = config.userId
    this._client = config.client
  }
}
