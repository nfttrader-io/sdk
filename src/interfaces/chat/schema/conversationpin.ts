import { Conversation } from "../../../core/chat"

/**
 * Interface representing the schema for a conversation pin.
 * @interface ConversationPinSchema
 */
export interface ConversationPinSchema {
  /**
   * @property {string} id - The unique identifier for the conversation pin.
   */
  id: string
  /**
   * @property {string} userId - The user ID associated with the conversation pin.
   */
  userId: string
  /**
   * @property {string} conversationId - The ID of the conversation being pinned.
   */
  conversationId: string
  /**
   * @property {Conversation} conversation - The conversation object being pinned.
   */
  conversation: Conversation
  /**
   * @property {Date} createdAt - The date and time when the conversation pin was created.
   */
  createdAt: Date
}
