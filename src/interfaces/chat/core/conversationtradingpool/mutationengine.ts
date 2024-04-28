import { ConversationTradingPool, QIError } from "../../../../core/chat"

export interface ConversationTradingPoolMutationEngine {
  deleteRequestTrade(id: string): Promise<ConversationTradingPool | QIError>
}
