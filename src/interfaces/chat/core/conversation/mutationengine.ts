import {
  Conversation,
  ConversationMember,
  ConversationReport,
  Message,
  QIError,
} from "../../../../core/chat"
import {
  AddMembersToConversationArgs,
  AddReportToConversationArgs,
  EjectMemberArgs,
  MuteConversationArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
} from "../../schema/args"

/**
 * Interface for a Conversation Mutation Engine that defines methods for mutating conversations.
 * @interface ConversationMutationEngine
 */
export interface ConversationMutationEngine {
  addMembersToConversation(
    args: AddMembersToConversationArgs
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
  addReportToConversation(
    args: AddReportToConversationArgs
  ): Promise<ConversationReport | QIError>
  archiveConversation(): Promise<Conversation | QIError>
  archiveConversation(id: string): Promise<Conversation | QIError>
  deleteMessage(id: string): Promise<Message | QIError>
  ejectMember(args: EjectMemberArgs): Promise<Conversation | QIError>
  leaveConversation(): Promise<Conversation | QIError>
  leaveConversation(id: string): Promise<Conversation | QIError>
  muteConversation(args: MuteConversationArgs): Promise<Conversation | QIError>
  sendMessage(args: SendMessageArgs): Promise<Message | QIError>
  unarchiveConversation(): Promise<Conversation | QIError>
  unarchiveConversation(id: string): Promise<Conversation | QIError>
  unmuteConversation(): Promise<Conversation | QIError>
  unmuteConversation(id: string): Promise<Conversation | QIError>
  updateConversationGroup(
    args: UpdateConversationGroupInputArgs
  ): Promise<Conversation | QIError>
  pinConversation(): Promise<Conversation | QIError>
  pinConversation(id: string): Promise<Conversation | QIError>
  unpinConversation(): Promise<Conversation | QIError>
  unpinConversation(id: string): Promise<Conversation | QIError>
}
