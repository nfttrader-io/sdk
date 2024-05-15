import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationReportInitConfig } from "../../interfaces/chat/core/conversationreport"
import { ConversationReportSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

/**
 * Represents a Conversation Report that extends the Engine class and implements the ConversationReportSchema interface.
 * @class ConversationReport
 * @extends Engine
 * @implements ConversationReportSchema
 */

export class ConversationReport
  extends Engine
  implements ConversationReportSchema
{
  /**
   * @property id - The unique identifier of the item.
   */
  readonly id: string
  /**
   * @property description - The optional description of the item.
   */
  readonly description: Maybe<string>
  /**
   * @property userId - The optional user id associated with the item.
   */
  readonly userId: Maybe<string>
  /**
   * @property createdAt - The timestamp when the item was created.
   */
  readonly createdAt: Date

  /**
   * Constructor for creating a ConversationReport object with the given configuration.
   * @param {ConversationReportInitConfig & EngineInitConfig} config - The configuration object containing JWT token, API key, API URLs, user key pair, key pairs map, id, description, user ID, creation timestamp, and client.
   * @returns None
   */
  constructor(config: ConversationReportInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })

    this.id = config.id
    this.description = config.description
    this.userId = config.userId
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
