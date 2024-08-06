import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"
import { Reaction } from "@src/core/chat/reaction"
import { Message } from "@src/core"

/**
 * Represents the configuration for initializing a message.
 * @type MessageInitConfig
 */
export type MessageInitConfig = {
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
   * @property {Date} createdAt - the creation date of the message.
   */
  createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - the update date of the message.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt - the delete date of the message.
   */
  deletedAt: Maybe<Date>
  /**
   * @property {Client} client - Represents a client object.
   */
  client: Client
}
