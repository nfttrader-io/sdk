import { ConversationTradingPool, QIError } from "../../../../core/chat"
import { RequestTradeArgs } from "../../schema/args"

export interface ConversationTradingPoolMutationEngine {
  deleteRequestTrade(id: string): Promise<ConversationTradingPool | QIError>
  requestTrade(
    args: RequestTradeArgs
  ): Promise<ConversationTradingPool | QIError>
}
