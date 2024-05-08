import { OperationResult } from "@urql/core"
import {
  Conversation,
  ConversationMember,
  QIError,
} from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"

import {
  Conversation as ConversationGraphQL,
  ConversationMember as ConversationMemberGraphQL,
  ListConversationMembers as ListConversationMembersGraphQL,
  SubscriptionOnAddMembersToConversationArgs,
  SubscriptionOnAddPinConversationArgs,
  SubscriptionOnArchiveConversationArgs,
  SubscriptionOnEjectMemberArgs,
  SubscriptionOnLeaveConversationArgs,
  SubscriptionOnMuteConversationArgs,
  SubscriptionOnRemovePinConversationArgs,
  SubscriptionOnUnarchiveConversationArgs,
  SubscriptionOnUpdateConversationGroupArgs,
} from "../../../../graphql/generated/graphql"

export interface ConversationSubscriptionEngine {
  onUpdateConversationGroup(
    id: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUpdateConversationGroup: ConversationGraphQL },
        SubscriptionOnUpdateConversationGroupArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onEjectMember(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onEjectMember: ConversationGraphQL },
        SubscriptionOnEjectMemberArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onLeaveConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onLeaveConversation: ConversationGraphQL },
        SubscriptionOnLeaveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onMuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onMuteConversation: ConversationGraphQL },
        SubscriptionOnMuteConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onArchiveConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onArchiveConversation: ConversationGraphQL },
        SubscriptionOnArchiveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onUnarchiveConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnarchiveConversation: ConversationGraphQL },
        SubscriptionOnUnarchiveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onUnmuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnmuteConversation: ConversationGraphQL },
        SubscriptionOnUnarchiveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onAddPinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onAddPinConversation: ConversationGraphQL },
        SubscriptionOnAddPinConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onRemovePinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onRemovePinConversation: ConversationGraphQL },
        SubscriptionOnRemovePinConversationArgs & { jwt: string }
      >
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
      >
    ) => void
  ): QIError | SubscriptionGarbage
}
