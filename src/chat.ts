import {
  Engine,
  User,
  BlacklistUserEntry,
  Conversation,
  QIError,
} from "./core/chat"
import {
  ConversationMutationEngine,
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
import {
  ArchiveConversationsBatchResult as ArchiveConversationsBatchResultGraphQL,
  Conversation as ConversationGraphQL,
  ConversationReport as ConversationReportGraphQL,
  ListConversationMembers as ListConversationMembersGraphQL,
  Message as MessageGraphQL,
  MessageReport as MessageReportGraphQL,
  MutationAddBlockedUserArgs,
  MutationAddMembersToConversationArgs,
  MutationAddPinToMessageArgs,
  MutationAddReactionToMessageArgs,
  MutationAddReportToConversationArgs,
  MutationAddReportToMessageArgs,
  MutationArchiveConversationArgs,
  MutationArchiveConversationsArgs,
  MutationCreateConversationGroupArgs,
  MutationCreateConversationOneToOneArgs,
  QueryGetConversationByIdArgs,
  User as UserGraphQL,
} from "./graphql/generated/graphql"

import {
  addBlockedUser,
  addMembersToConversation,
  addPinToMessage,
  addReactionToMessage,
  addReportToConversation,
  addReportToMessage,
  archiveConversation,
  archiveConversations,
  createConversationGroup,
  createConversationOneToOne,
} from "./constants/chat/mutations"
import { getConversationById } from "./constants/chat/queries"
import { AddMembersToConversationArgs } from "./interfaces/chat/schema/args/addmemberstoconversation"
import { ConversationMember } from "./core/chat/conversationmember"

export default class Chat
  extends Engine
  implements
    UserQueryEngine,
    UserMutationEngine,
    UserSubscriptionEngine,
    ConversationMutationEngine,
    ConversationSubscriptionEngine,
    MessageQueryEngine,
    MessageMutationEngine,
    MessageSubscriptionEngine,
    RequestTradeQueryEngine,
    RequestTradeMutationEngine,
    RequestTradeSubscriptionEngine
{
  async blockUser(): Promise<User | QIError>
  async blockUser(id: string): Promise<User | QIError>
  async blockUser(id?: unknown): Promise<User | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use blockUser(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddBlockedUserArgs,
      { addBlockedUser: UserGraphQL },
      UserGraphQL
    >("addBlockedUser", addBlockedUser, "_mutation() -> blockUser()", {
      blockId: id,
    })

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isNft: response.isNft ? response.isNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      encryptedPrivateKey: response.encryptedPrivateKey
        ? response.encryptedPrivateKey
        : null,
      publicKey: response.publicKey ? response.publicKey : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  async addMembersToConversation(
    membersIds: [
      {
        memberId: string
        encryptedConversationPrivateKey: string
        encryptedConversationPublicKey: string
      }
    ]
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
  async addMembersToConversation(
    args: AddMembersToConversationArgs
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
  async addMembersToConversation(
    args: unknown
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  > {
    if (!args || !("id" in (args as AddMembersToConversationArgs))) {
      throw new Error(
        "args can not be null or undefined. Consider to use addMembersToConversation(args: AddMembersToConversationArgs) instead."
      )
    } else {
      const response = await this._query<
        MutationAddMembersToConversationArgs,
        { addMembersToConversation: ListConversationMembersGraphQL },
        ListConversationMembersGraphQL
      >(
        "addMembersToConversation",
        addMembersToConversation,
        "_mutation() -> addMembersToConversation()",
        {
          input: {
            conversationId: (args as AddMembersToConversationArgs).id,
            membersIds: (args as AddMembersToConversationArgs).membersIds,
          },
        }
      )

      if (response instanceof QIError) return response

      const listConversations: {
        conversationId: string
        items: Array<ConversationMember>
      } = {
        conversationId: response.conversationId,
        items: response.items.map((item) => {
          return new ConversationMember({
            ...this._parentConfig!,
            id: item.id,
            conversationId: item.conversationId ? item.conversationId : null,
            userId: item.userId,
            type: item.type,
            encryptedConversationPublicKey: item.encryptedConversationPublicKey,
            encryptedConversationPrivateKey:
              item.encryptedConversationPrivateKey,
            createdAt: item.createdAt ? item.createdAt : null,
            client: this._client!,
          })
        }),
      }

      return listConversations
    }
  }

  async blacklist(): Promise<BlacklistUserEntry[]> {
    return new Promise(() => {})
  }

  async getConversationById(id: string): Promise<Conversation | QIError> {
    const response = await this._query<
      QueryGetConversationByIdArgs,
      { getConversationById: ConversationGraphQL },
      ConversationGraphQL
    >(
      "getConversationById",
      getConversationById,
      "_query() -> getConversationById()",
      {
        conversationId: id,
      }
    )

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
