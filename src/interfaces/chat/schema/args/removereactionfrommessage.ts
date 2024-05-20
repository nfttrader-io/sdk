/**
 * Represents the arguments needed to remove a reaction from a message in a conversation.
 * @interface RemoveReactionFromMessageArgs
 */
export interface RemoveReactionFromMessageArgs {
  /**
   * @property {string} conversationId - the conversation id related to the reaction message.
   */
  conversationId: string
  /**
   * @property {string} reaction - the reaction to remove.
   */
  reaction: string
  /**
   * @property {string} messageId - the message id related to the reaction.
   */
  messageId: string
}
