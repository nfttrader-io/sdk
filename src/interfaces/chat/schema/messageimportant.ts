import { Message } from "../../../core/chat"

/**
 * Represents the schema for an important message in a conversation.
 * @interface MessageImportantSchema
 */
export interface MessageImportantSchema {
  /**
   * @property {string} id - The unique identifier of the important message.
   */
  id: string
  /**
   * @property {string} userId - The user ID of the user who marked the message as important.
   */
  userId: string
  /**
   * @property {string} messageId - The ID of the message marked as important.
   */
  messageId: string
  /**
   * @property {Message} message - The actual message object.
   */
  message: Message
  /**
   * @property {string} conversationId - The ID of the conversation to which the message belongs.
   */
  conversationId: string
  /**
   * @property {Date} createdAt - The date and time when the message was marked as important.
   */
  createdAt: Date
}
