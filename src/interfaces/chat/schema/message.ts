import Maybe from "../../../types/general/maybe"

/**
 * Represents the schema for a message in a conversation.
 * @interface MessageSchema
 */
export interface MessageSchema {
  /**
   * @property {string} id - The unique identifier of the message.
   */
  id: string
  /**
   * @property {string} content - The content of the message.
   */
  content: string
  /**
   * @property {Maybe<string>} conversationId - The ID of the conversation the message belongs to.
   */
  conversationId: Maybe<string>
  /**
   * @property {Maybe<string>} userId - The ID of the user who sent the message.
   */
  userId: Maybe<string>
  /**
   * @property {Maybe<string>} messageRootId - The ID of the root message in a thread.
   */
  messageRootId: Maybe<string>
  /**
   * @property {Maybe<"TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT">} type - The type of the message.
   */
  type: Maybe<"TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT">
  /**
   * @property {Date} createdAt - Represents a timestamp for when an entity was created.
   */
  createdAt: Date
  /**
   * @property {Date} updatedAt - Represents a timestamp for when an entity was updated.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Date} deletedAt - Represents a timestamp for when an entity was deleted.
   */
  deletedAt: Maybe<Date>
}
