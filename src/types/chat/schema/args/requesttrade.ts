/**
 * Represents the arguments needed to request a trade.
 * @type RequestTradeArgs
 */
export type RequestTradeArgs = {
  /**
   * @property {Array<string>} creatorsIds - The array of creator IDs involved in the trade.
   */
  creatorsIds: Array<string>
  /**
   * @property {Array<string>} initializatorIds - The array of initializator IDs involved in the trade.
   */
  initializatorIds: Array<string>
  /**
   * @property {string} conversationId - The ID of the conversation related to the trade.
   */
  conversationId: string
  /**
   * @property {JSON} operation - The JSON object representing the trade operation.
   */
  operation: JSON
}
