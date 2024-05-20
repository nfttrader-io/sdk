import { OperationResult } from "@urql/core"
import { Message, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  SubscriptionOnAddImportantMessageArgs,
  SubscriptionOnAddPinMessageArgs,
  SubscriptionOnAddReactionArgs,
  SubscriptionOnDeleteMessageArgs,
  SubscriptionOnEditMessageArgs,
  SubscriptionOnRemoveImportantMessageArgs,
  SubscriptionOnRemovePinMessageArgs,
  SubscriptionOnRemoveReactionArgs,
  SubscriptionOnSendMessageArgs,
} from "../../../../graphql/generated/graphql"
import { Message as MessageGraphQL } from "../../../../graphql/generated/graphql"

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
      >
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
      >
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
      >
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
      >
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
      >
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
      >
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
      >
    ) => void
  ): SubscriptionGarbage | QIError
  onAddImportantMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onAddImportantMessage: MessageGraphQL
        },
        SubscriptionOnAddImportantMessageArgs & {
          jwt: string
        }
      >
    ) => void
  ): SubscriptionGarbage | QIError
  onRemoveImportantMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onRemoveImportantMessage: MessageGraphQL
        },
        SubscriptionOnRemoveImportantMessageArgs & {
          jwt: string
        }
      >
    ) => void
  ): SubscriptionGarbage | QIError
}
