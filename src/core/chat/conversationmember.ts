import { ConversationMemberInitConfig } from "../../types/chat/core/conversationmember"
import { ConversationMemberSchema } from "../../interfaces/chat/schema"
import { Maybe } from "../../types/base"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../types"

/**
 * Represents a conversation member in the chat system.
 * @class ConversationMember
 * @extends Engine
 * @implements ConversationMemberSchema
 */

export class ConversationMember
  extends Engine
  implements ConversationMemberSchema
{
  /**
   * @property {string} id - The unique identifier of the conversation.
   */
  readonly id: string
  /**
   * @property {string} conversationId - The identifier of the conversation, if available.
   */
  readonly conversationId: string
  /**
   * @property {string} userId - The user ID associated with the conversation.
   */
  readonly userId: string
  /**
   * @property {"USER" | "ADMINISTRATOR"} type - The type of the conversation, either "USER" or "ADMINISTRATOR".
   */
  readonly type: "USER" | "ADMINISTRATOR"
  /**
   * @property {string} encryptedConversationPublicKey - The public key used for encryption in the conversation.
   */
  readonly encryptedConversationPublicKey: string
  /**
   * @property {string} encryptedConversationPrivateKey - The private key used for encryption in the conversation.
   */
  readonly encryptedConversationPrivateKey: string
  /**
   * @property {Date} createdAt - The date and time when the conversation was
   */
  readonly createdAt: Date

  /**
   * Constructor for creating a ConversationMember object with the given configuration.
   * @param {ConversationMemberInitConfig & EngineInitConfig} config - The configuration object containing initialization parameters.
   * @returns None
   */
  constructor(config: ConversationMemberInitConfig & EngineInitConfig) {
    super({
      apiKey: config.apiKey,
      storage: config.storage,
    })

    this.id = config.id
    this.conversationId = config.conversationId
    this.userId = config.userId
    this.type = config.type
    this.encryptedConversationPrivateKey =
      config.encryptedConversationPrivateKey
    this.encryptedConversationPublicKey = config.encryptedConversationPublicKey
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
