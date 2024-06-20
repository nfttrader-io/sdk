/**
 * Represents the arguments needed to edit a message in a conversation.
 * @type EditMessageArgs
 */
export type EditMessageArgs = {
  /**
   * @property {string} conversationId - The ID of the conversation where the message belongs.
   */
  conversationId: string
  /**
   * @property {string} id - The ID of the message to be edited.
   */
  id: string
  /**
   * @property {string} content - The new content of the message.
   */
  content: string
}
