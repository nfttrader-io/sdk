import { Maybe } from "../../../types/base"

/**
 * Interface representing the schema for a conversation.
 * @interface ConversationSchema
 */
export interface ConversationSchema {
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
   * @property {Maybe<URL>} imageURL - The URL of the image associated with the conversation.
   */
  imageURL: Maybe<URL>
  /**
   *  @property {Maybe<URL>} bannerImageURL - The URL of the banner image associated with the conversation.
   */
  bannerImageURL: Maybe<URL>
  /**
   * @property {Maybe<JSON>} settings - Additional settings for the conversation.
   */
  settings: Maybe<JSON>
  /**
   * @property {Maybe<Array<Maybe<string>>} membersIds - An array of member IDs in the conversation.
   */
  membersIds: Maybe<Array<Maybe<string>>>
  /**
   * @property {'GROUP' | 'ONE_TO_ONE' | 'COMMUNITY'} type - Represents a message type which can be one of "GROUP", "ONE_TO_ONE", or "COMMUNITY".
   */
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  /**
   * @property {Maybe<Date>} lastMessageSentAt - The date when the message was last sent, if available.
   */
  lastMessageSentAt: Maybe<Date>
  /**
   * @property {Maybe<string>} ownerId - The ID of the message owner, if available.
   */
  ownerId: Maybe<string>
  /**
   * @property {Date} createdAt - The date when the message was created.
   */
  createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - The date when the message was last updated, if available.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt - The date when the message was deleted, if available.
   */
  deletedAt: Maybe<Date>
}
