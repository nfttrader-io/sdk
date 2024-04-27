import { ConversationMember, QIError } from "../../../../core/chat"
import { AddMembersToConversationArgs } from "../../schema/args/addmemberstoconversation"

export interface ConversationMutationEngine {
  addMembersToConversation(
    membersIds: [
      {
        memberId: string
        encryptedConversationPrivateKey: string
        encryptedConversationPublicKey: string
      }
    ]
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
  addMembersToConversation(
    args: AddMembersToConversationArgs
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
}
