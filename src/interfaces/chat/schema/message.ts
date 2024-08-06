import { Reaction } from "@src/core/chat/reaction"
import { Maybe } from "../../../types/base"
import { Message } from "@src/core"

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
   * @property {string} conversationId - The ID of the conversation the message belongs to.
   */
  conversationId: string
  /**
   * @property {Maybe<Array<Reaction>>} reactions - The reactions related to this message.
   */
  reactions: Maybe<Array<Reaction>>
  /**
   * @property {string} userId - The ID of the user who sent the message.
   */
  userId: string
  /**
   * @property {Maybe<Omit<Message, "messageRoot">>} messageRoot - The root message in a thread.
   */
  messageRoot: Maybe<Omit<Message, "messageRoot">>
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
