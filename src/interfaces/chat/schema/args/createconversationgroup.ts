/**
 * Interface for creating a conversation group with the specified properties.
 * @interface CreateConversationGroupArgs
 */
export interface CreateConversationGroupArgs {
  /**
   * @property {string} name - The name of the conversation group.
   */
  name: string
  /**
   * @property {string} description - The description of the conversation group.
   */
  description: string
  /**
   * @property {string} imageURL - The URL of the image associated with the conversation group.
   */
  imageURL: string
  /**
   * @property {string} bannerImageURL - The URL of the banner image for the conversation group.
   */
  bannerImageURL: string
}
