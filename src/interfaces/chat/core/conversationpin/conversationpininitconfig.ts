import { Client } from "@urql/core"
import { Conversation } from "../../../../core/chat"

/**
 * Interface for Conversation Pin Initialization Configuration.
 * @interface ConversationPinInitConfig
 */
export interface ConversationPinInitConfig {
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
   * @property {Date} createdAt - The date and time when the pin was created.
   */
  createdAt: Date
  /**
   * @property {Client} client - The client associated with the conversation pin.
   */
  client: Client
}
