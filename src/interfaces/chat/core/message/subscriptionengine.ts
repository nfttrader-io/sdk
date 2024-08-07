import { OperationResult } from "@urql/core"
import { Message, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  SubscriptionOnAddPinMessageArgs,
  SubscriptionOnAddReactionArgs,
  SubscriptionOnBatchDeleteMessagesArgs,
  SubscriptionOnDeleteMessageArgs,
  SubscriptionOnEditMessageArgs,
  SubscriptionOnRemovePinMessageArgs,
  SubscriptionOnRemoveReactionArgs,
  SubscriptionOnSendMessageArgs,
} from "../../../../graphql/generated/graphql"
import {
  Message as MessageGraphQL,
  BatchDeleteMessagesResult as BatchDeleteMessagesResultGraphQL,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for a Message Subscription Engine that provides methods to subscribe to various message-related events.
 * @interface MessageSubscriptionEngine
 */
export interface MessageSubscriptionEngine {
  onSendMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onSendMessage: MessageGraphQL
        },
        SubscriptionOnSendMessageArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onEditMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onEditMessage: MessageGraphQL
        },
        SubscriptionOnEditMessageArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onDeleteMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onDeleteMessage: MessageGraphQL
        },
        SubscriptionOnDeleteMessageArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onBatchDeleteMessages(
    conversationId: string,
    callback: (
      response: { conversationId: string; messagesIds: string[] } | QIError,
      source: OperationResult<
        {
          onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL
        },
        SubscriptionOnBatchDeleteMessagesArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onAddReaction(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onAddReaction: MessageGraphQL
        },
        SubscriptionOnAddReactionArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onRemoveReaction(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onRemoveReaction: MessageGraphQL
        },
        SubscriptionOnRemoveReactionArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onAddPinMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onAddPinMessage: MessageGraphQL
        },
        SubscriptionOnAddPinMessageArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
  onRemovePinMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onRemovePinMessage: MessageGraphQL
        },
        SubscriptionOnRemovePinMessageArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError
}
