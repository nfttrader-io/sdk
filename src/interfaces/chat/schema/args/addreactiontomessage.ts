/**
 * Represents the arguments needed to add a reaction to a message in a conversation.
 * @interface AddReactionToMessageArgs
 */
export interface AddReactionToMessageArgs {
  /**
   * @property {string} conversationId - the conversation id of the message.
   */
  conversationId: string
  /**
   * @property {string} reaction - the reaction to add.
   */
  reaction: string
  /**
   * @property {string} messageId - the message id on which the reaction will be attached.
   */
  messageId: string
}
