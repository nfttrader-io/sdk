import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"

/**
 * Represents the configuration for initializing a conversation.
 * @type ConversationInitConfig
 */
export type ConversationInitConfig = {
  /**
   * @property {string} id - The unique identifier for the conversation.
   */
  id: string
  /**
   * @property {string} name - The name of the conversation.
   */
  name: string
  /**
   * @property {Maybe<string>} description - The description of the conversation.
   */
  description: Maybe<string>
  /**
   * @property {Maybe<string>} imageURL - The URL of the image associated with the conversation.
   */
  imageURL: Maybe<string>
  /**
   * @property {Maybe<string>} bannerImageURL - The URL of the banner image for the conversation.
   */
  bannerImageURL: Maybe<string>
  /**
   * @property {Maybe<string>} settings - Additional settings for the conversation.
   */
  settings: Maybe<string>
  /**
   * @property {Maybe<Array<string>>} membersIds - An array of member IDs in the conversation.
   */
  membersIds: Maybe<Array<string>>
  /**
   * @property {Maybe<Array<{userId: string, createdAt: Date}>>} mutedBy - An array of member IDs in the conversation.
   */
  mutedBy: Maybe<Array<{ userId: string; createdAt: Date }>>
  /**
   * @property {"GROUP" | "ONE_TO_ONE" | "COMMUNITY"} type - The type of the chat group.
   */
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  /**
   * @property {Maybe<Date>} lastMessageSentAt - The date when the last message was sent in the group.
   */
  lastMessageSentAt: Maybe<Date>
  /**
   * @property {Maybe<string>} ownerId - The ID of the owner of the chat group.
   */
  ownerId: Maybe<string>
  /**
   * @property {Date} createdAt - The date when the chat group was created.
   */
  createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - The date when the chat group was last updated.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt - The date when the chat group was deleted.
   */
  deletedAt: Maybe<Date>
  /**
   * @property {Client} client - The client object.
   */
  client: Client
}
