import { ConversationTradingPool, QIError } from "../../../../core/chat"
import { RequestTradeArgs } from "../../schema/args"

/**
 * Interface for a Conversation Trading Pool Mutation Engine, which defines methods for
 * deleting a request trade and requesting a trade.
 * @interface ConversationTradingPoolMutationEngine
 */
export interface ConversationTradingPoolMutationEngine {
  deleteRequestTrade(id: string): Promise<ConversationTradingPool | QIError>
  requestTrade(
    args: RequestTradeArgs
  ): Promise<ConversationTradingPool | QIError>
}
