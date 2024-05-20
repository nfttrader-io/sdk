/**
 * Interface for updating conversation group input arguments.
 * @interface UpdateConversationGroupInputArgs
 */
export interface UpdateConversationGroupInputArgs {
  /**
   * @property {string} conversationId - The ID of the conversation group.
   */
  conversationId: string
  /**
   * @property {string} description - The description of the conversation group.
   */
  description: string
  /**
   * @property {string} imageURL - The URL of the image associated with the conversation group.
   */
  imageURL: string
  /**
   *  @property {string} bannerImageURL - The URL of the banner image for the conversation group.
   */
  bannerImageURL: string
  /**
   * @property {string} name - The name of the conversation group.
   */
  name: string
  /**
   * @property {JSON} settings - The settings of the conversation group in JSON format.
   */
  settings: JSON
}
