import { ActiveUserConversationType } from "../../../../enums/chat"
/**
 * Represents the arguments for listing all active user conversation IDs.
 * @type ListAllActiveUserConversationIdsArgs
 */
export type ListAllActiveUserConversationIdsArgs = {
  /**
   * @property {ActiveUserConversationType} type - The type of active user conversation.
   */
  type: ActiveUserConversationType
  /**
   * @property {string} nextToken - The token for paginating through the list of active user conversations.
   */
  nextToken: string
}
