import Maybe from "../../../types/general/maybe"

export interface ConversationMemberSchema {
  id: string
  conversationId: Maybe<string>
  userId: string
  //user -> method, define it in conversationmemberengine.ts?
  type: "USER" | "ADMINISTRATOR"
  encryptedConversationPublicKey: string
  encryptedConversationPrivateKey: string
  createdAt: Maybe<Date>
}
