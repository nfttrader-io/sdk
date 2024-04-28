import {
  Conversation,
  ConversationMember,
  ConversationReport,
  Message,
  QIError,
} from "../../../../core/chat"
import { MutedDuration } from "../../../../enums/chat"
import {
  AddMembersToConversationArgs,
  AddReportToConversationArgs,
  EjectMemberArgs,
  MuteConversationArgs,
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
  deleteMessage(id: string): Promise<Message | QIError>
  ejectMember(args: EjectMemberArgs): Promise<Conversation | QIError>
  leaveConversation(): Promise<Conversation | QIError>
  leaveConversation(id: string): Promise<Conversation | QIError>
  muteConversation(duration: MutedDuration): Promise<Conversation | QIError>
  muteConversation(args: MuteConversationArgs): Promise<Conversation | QIError>
}
