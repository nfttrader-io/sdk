/**
 * Interface for adding members to a conversation.
 * @interface AddMembersToConversationArgs
 */
export interface AddMembersToConversationArgs {
  /**
   * @property {string} id - The ID of the conversation.
   */
  id: string
  /**
   * @property {Array} membersIds - An array of objects containing member details:
   * - memberId: The ID of the member.
   * - encryptedConversationPrivateKey: The encrypted private key for the conversation.
   * - encryptedConversationPublicKey: The encrypted public key for the conversation.
   */
  membersIds: [
    {
      memberId: string
      encryptedConversationPrivateKey: string
      encryptedConversationPublicKey: string
    }
  ]
}
