import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationMemberInitConfig } from "../../interfaces/chat/core/conversationmember"
import { ConversationMemberSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

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
   * @property {string | null} conversationId - The identifier of the conversation, if available.
   */
  readonly conversationId: Maybe<string>
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
   * @property {Date | null} createdAt - The date and time when the conversation was
   */
  readonly createdAt: Maybe<Date>

  /**
   * Constructor for creating a ConversationMember object with the given configuration.
   * @param {ConversationMemberInitConfig & EngineInitConfig} config - The configuration object containing initialization parameters.
   * @returns None
   */
  constructor(config: ConversationMemberInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
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
