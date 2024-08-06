import {
  Conversation,
  ConversationMember,
  ConversationReport,
  Message,
  QIError,
  User,
} from "../../../../core/chat"
import {
  AddMembersToConversationArgs,
  AddMemberToConversationArgs,
  AddReportToConversationArgs,
  EjectMemberArgs,
  MuteConversationArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
} from "../../../../types/chat/schema/args"

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
  addMemberToConversation(
    args: AddMemberToConversationArgs
  ): Promise<ConversationMember | QIError>
  addReportToConversation(
    args: AddReportToConversationArgs
  ): Promise<ConversationReport | QIError>
  archiveConversation(): Promise<User | QIError>
  archiveConversation(id: string): Promise<User | QIError>
  deleteMessage(id: string): Promise<Message | QIError>
  ejectMember(args: EjectMemberArgs): Promise<Conversation | QIError>
  leaveConversation(): Promise<Conversation | QIError>
  leaveConversation(id: string): Promise<Conversation | QIError>
  muteConversation(args: MuteConversationArgs): Promise<Conversation | QIError>
  sendMessage(args: SendMessageArgs): Promise<Message | QIError>
  unarchiveConversation(): Promise<User | QIError>
  unarchiveConversation(id: string): Promise<User | QIError>
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
