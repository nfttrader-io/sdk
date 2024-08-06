/**
 * type for adding member to a conversation.
 * @type AddMemberToConversationArgs
 */
export type AddMemberToConversationArgs = {
  /**
   * @property {string} id - The ID of the conversation.
   */
  id: string
  /**
   * @property {Array} member - An array of objects containing member details:
   * - memberId: The ID of the member.
   * - encryptedConversationPrivateKey: The encrypted private key for the conversation.
   * - encryptedConversationPublicKey: The encrypted public key for the conversation.
   */
  member: {
    memberId: string
    encryptedConversationPrivateKey: string
    encryptedConversationPublicKey: string
  }
}
