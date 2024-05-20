/**
 * Interface representing the arguments for listing messages by conversation ID.
 * @interface ListMessagesByConversationIdArgs
 */
export interface ListMessagesByConversationIdArgs {
  /**
   * @property {string} id - The ID of the conversation.
   */
  id: string
  /**
   * @property {string} nextToken - Optional. The token for paginating through the list of messages.
   */
  nextToken?: string
}
