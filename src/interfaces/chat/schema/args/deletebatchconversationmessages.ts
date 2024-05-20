/**
 * Represents the arguments needed to delete a batch of conversation messages.
 * @interface DeleteBatchConversationMessagesArgs
 */
export interface DeleteBatchConversationMessagesArgs {
  /**
   * @property {string} id - The ID of the conversation.
   */
  id: string
  /**
   * @property {Array<string>} messagesIds - An array of message IDs to be deleted.
   */
  messagesIds: Array<string>
}
