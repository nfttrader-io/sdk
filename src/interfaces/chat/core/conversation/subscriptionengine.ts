import { OperationResult } from "@urql/core"
import {
  Conversation,
  ConversationMember,
  QIError,
  User,
} from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  Conversation as ConversationGraphQL,
  ListConversationMembers as ListConversationMembersGraphQL,
  SubscriptionOnAddMembersToConversationArgs,
  SubscriptionOnAddMemberToConversationArgs,
  SubscriptionOnAddPinConversationArgs,
  SubscriptionOnEjectMemberArgs,
  SubscriptionOnLeaveConversationArgs,
  SubscriptionOnMuteConversationArgs,
  SubscriptionOnRemovePinConversationArgs,
  SubscriptionOnUnmuteConversationArgs,
  SubscriptionOnUpdateConversationGroupArgs,
  AddMemberToConversationResult as AddMemberToConversationResultGraphQL,
  MemberOutResult as MemberOutResultGraphQL,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for managing subscriptions related to conversations.
 * @interface ConversationSubscriptionEngine
 */
export interface ConversationSubscriptionEngine {
  onUpdateConversationGroup(
    id: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUpdateConversationGroup: ConversationGraphQL },
        SubscriptionOnUpdateConversationGroupArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onEjectMember(
    conversationId: string,
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            conversation: Conversation
            memberOut: User
          },
      source: OperationResult<
        { onEjectMember: MemberOutResultGraphQL },
        SubscriptionOnEjectMemberArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onLeaveConversation(
    conversationId: string,
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            conversation: Conversation
            memberOut: User
          },
      source: OperationResult<
        { onLeaveConversation: MemberOutResultGraphQL },
        SubscriptionOnLeaveConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onMuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onMuteConversation: ConversationGraphQL },
        SubscriptionOnMuteConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onUnmuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnmuteConversation: ConversationGraphQL },
        SubscriptionOnUnmuteConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onAddPinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onAddPinConversation: ConversationGraphQL },
        SubscriptionOnAddPinConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onRemovePinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onRemovePinConversation: ConversationGraphQL },
        SubscriptionOnRemovePinConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onAddMembersToConversation(
    conversationId: string,
    callback: (
      response:
        | QIError
        | { conversationId: string; items: Array<ConversationMember> },
      source: OperationResult<
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        SubscriptionOnAddMembersToConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
  onAddMemberToConversation(
    conversationId: string,
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            memberId: string
            item: ConversationMember
          },
      source: OperationResult<
        { onAddMemberToConversation: AddMemberToConversationResultGraphQL },
        SubscriptionOnAddMemberToConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage
}
