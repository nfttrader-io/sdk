import { OperationResult } from "@urql/core"
import { ConversationTradingPool, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  ConversationTradingPool as ConversationTradingPoolGraphQL,
  SubscriptionOnDeleteRequestTradeArgs,
  SubscriptionOnRequestTradeArgs,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for a Conversation Trading Pool Subscription Engine that handles
 * trade requests and deletions.
 * @interface ConversationTradingPoolSubscriptionEngine
 */
export interface ConversationTradingPoolSubscriptionEngine {
  onRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnRequestTradeArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
  onDeleteRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnDeleteRequestTradeArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
}
