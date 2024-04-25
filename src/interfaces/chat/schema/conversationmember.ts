export interface ConversationMemberSchema {
  id: string
  conversationId: string
  userId: string
  //user -> method, define it in conversationmemberengine.ts?
  type: "USER" | "ADMINISTRATOR"
  encryptedConversationPublicKey: string
  encryptedConversationPrivateKey: string
  createdAt: Date
}
