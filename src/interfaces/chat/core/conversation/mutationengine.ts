import {
  Conversation,
  ConversationMember,
  ConversationReport,
  QIError,
} from "../../../../core/chat"
import {
  AddMembersToConversationArgs,
  AddReportToConversationArgs,
} from "../../schema/args"

export interface ConversationMutationEngine {
  addMembers(
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
  addConversationReport(
    description: string
  ): Promise<ConversationReport | QIError>
  addReportToConversation(
    args: AddReportToConversationArgs
  ): Promise<ConversationReport | QIError>
  archiveConversation(): Promise<Conversation | QIError>
  archiveConversation(id: string): Promise<Conversation | QIError>
}
