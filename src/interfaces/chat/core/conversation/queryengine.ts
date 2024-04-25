import { QIError, User } from "../../../../core/chat"

export interface ConversationQueryEngine {
  owner?: () => Promise<User | QIError>
}
