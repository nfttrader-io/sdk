export interface AddMembersToConversationArgs {
  id: string
  membersIds: [
    {
      memberId: string
      encryptedConversationPrivateKey: string
      encryptedConversationPublicKey: string
    }
  ]
}
