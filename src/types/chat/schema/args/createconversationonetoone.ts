/**
 * type for creating a one-to-one conversation.
 * @type CreateConversationOneToOneArgs
 */
export type CreateConversationOneToOneArgs = {
  /**
   * @property {string} name - The name of the conversation.
   */
  name: string
  /**
   * @property {string} description - The description of the conversation.
   */
  description: string
  /**
   * @property {string} imageURL - The URL of the image associated with the conversation.
   */
  imageURL: string
  /**
   * @property {string} bannerImageURL - The URL of the banner image associated with the conversation.
   */
  bannerImageURL: string
}
