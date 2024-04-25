import {
  Engine,
  User,
  BlacklistUserEntry,
  Conversation,
  QIError,
} from "./core/chat"
import {
  ConversationMutationEngine,
  ConversationQueryEngine,
  ConversationSubscriptionEngine,
} from "./interfaces/chat/core/conversation"
import {
  MessageMutationEngine,
  MessageQueryEngine,
  MessageSubscriptionEngine,
} from "./interfaces/chat/core/message"
import {
  RequestTradeMutationEngine,
  RequestTradeQueryEngine,
  RequestTradeSubscriptionEngine,
} from "./interfaces/chat/core/requesttrade"
import {
  UserMutationEngine,
  UserQueryEngine,
  UserSubscriptionEngine,
} from "./interfaces/chat/core/user"

export default class Chat
  extends Engine
  implements
    UserQueryEngine,
    UserMutationEngine,
    UserSubscriptionEngine,
    ConversationQueryEngine,
    ConversationMutationEngine,
    ConversationSubscriptionEngine,
    MessageQueryEngine,
    MessageMutationEngine,
    MessageSubscriptionEngine,
    RequestTradeQueryEngine,
    RequestTradeMutationEngine,
    RequestTradeSubscriptionEngine
{
  owner: undefined

  async blockUser(): Promise<User | QIError> {
    return new Promise(() => {})
  }
  async blacklist(): Promise<BlacklistUserEntry[]> {
    return new Promise(() => {})
  }

  async test(): Promise<Conversation | QIError> {
    const response = await this._getConversationById({
      conversationId: "3dc4a129-fecc-4c02-852a-53cd3765e0d3",
    })
    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? new URL(response.imageURL) : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(response.bannerImageURL)
        : null,
      settings: response.settings ? JSON.parse(response.settings) : null,
      membersIds: response.membersIds ? response.membersIds : null,
      type: response.type,
      lastMessageSentAt: response.lastMessageSentAt
        ? response.lastMessageSentAt
        : null,
      ownerId: response.ownerId ? response.ownerId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }
}
