/**
 * Represents the arguments for listing important messages by user conversation ID.
 * @type ListMessagesImportantByUserConversationIdArgs
 */
export type ListMessagesImportantByUserConversationIdArgs = {
  /**
   * @property {string} conversationId - The ID of the conversation to list important messages for.
   */
  conversationId: string
  /**
   * @property {string} nextToken - An optional token for paginating through the list of messages.
   */
  nextToken?: string
}
