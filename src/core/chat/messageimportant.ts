import { EngineInitConfig } from "../../interfaces/chat/core"
import { MessageImportantInitConfig } from "../../types/chat/core/messageimportant"
import { MessageImportantSchema } from "../../interfaces/chat/schema"
import { Engine } from "./engine"
import { Message } from "./message"

/**
 * Represents an important message in the chat system.
 * Extends the Engine class and implements the MessageImportantSchema interface.
 * @class MessageImportant
 * @extends Engine
 * @implements MessageImportantSchema
 */

export class MessageImportant extends Engine implements MessageImportantSchema {
  /**
   * @property {string} id - The unique identifier of the message.
   */
  readonly id: string
  /**
   * @property {string} userId - The user ID associated with the message.
   */
  readonly userId: string
  /**
   * @property {string} messageId - The ID of the message.
   */
  readonly messageId: string
  /**
   * @property {string} conversationId - The ID of the conversation the message belongs to.
   */
  readonly conversationId: string
  /**
   * @property {Date} createdAt - The date and time when the message was created.
   */
  readonly createdAt: Date
  /**
   * @property {Message} message - The content of the message.
   */
  readonly message: Message

  /**
   * Constructs a new instance of a MessageImportant class with the provided configuration.
   * @param {MessageImportantInitConfig & EngineInitConfig} config - The configuration object containing necessary parameters.
   * @returns None
   */
  constructor(config: MessageImportantInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })

    this.id = config.id
    this.userId = config.userId
    this.messageId = config.messageId
    this.message = config.message
    this.conversationId = config.conversationId
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
