import {
  Engine,
  User,
  BlacklistUserEntry,
  Conversation,
  QIError,
  Message,
  ConversationReport,
  MessageReport,
  ConversationTradingPool,
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
  ConversationTradingPoolMutationEngine,
  ConversationTradingPoolQueryEngine,
  ConversationTradingPoolSubscriptionEngine,
} from "./interfaces/chat/core/conversationtradingpool"
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
  ConversationTradingPool as ConversationTradingPoolGraphQL,
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
  MutationDeleteBatchConversationMessagesArgs,
  MutationDeleteConversationMessageArgs,
  MutationDeleteRequestTradeArgs,
  QueryGetConversationByIdArgs,
  User as UserGraphQL,
  MutationEditMessageArgs,
  MutationEjectMemberArgs,
  MutationEraseConversationByAdminArgs,
  EraseConversationByAdminBatchResult as EraseConversationByAdminBatchResultGraphQL,
  MutationLeaveConversationArgs,
  MutationMuteConversationArgs,
  MutationRemoveBlockedUserArgs,
  MutationRemovePinFromMessageArgs,
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
  deleteBatchConversationMessages,
  deleteConversationMessage,
  deleteRequestTrade,
  editMessage,
  ejectMember,
  eraseConversationByAdmin,
  leaveConversation,
  muteConversation,
  removeBlockedUser,
  removePinFromMessage,
} from "./constants/chat/mutations"
import { getConversationById } from "./constants/chat/queries"
import { AddMembersToConversationArgs } from "./interfaces/chat/schema/args/addmemberstoconversation"
import { ConversationMember } from "./core/chat/conversationmember"
import {
  AddReactionToMessageArgs,
  AddReportToConversationArgs,
  AddReportToMessageArgs,
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
  EditMessageArgs,
  MuteConversationArgs,
} from "./interfaces/chat/schema/args"
import { UAMutationEngine } from "./interfaces/chat/core/ua"
import { EjectMemberArgs } from "./interfaces/chat/schema/args/ejectmember"

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
    ConversationTradingPoolQueryEngine,
    ConversationTradingPoolMutationEngine,
    ConversationTradingPoolSubscriptionEngine,
    UAMutationEngine
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

  async addMembers(
    membersIds: [
      {
        memberId: string
        encryptedConversationPrivateKey: string
        encryptedConversationPublicKey: string
      }
    ]
  ): Promise<
    QIError | { conversationId: string; items: Array<ConversationMember> }
  > {
    throw new Error("Method not implemented.")
  }

  async addMembersToConversation(
    args: AddMembersToConversationArgs
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  > {
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
          encryptedConversationPrivateKey: item.encryptedConversationPrivateKey,
          createdAt: item.createdAt ? item.createdAt : null,
          client: this._client!,
        })
      }),
    }

    return listConversations
  }

  async pinMessage(): Promise<Message | QIError>
  async pinMessage(id: string): Promise<Message | QIError>
  async pinMessage(id?: unknown): Promise<Message | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use pinMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddPinToMessageArgs,
      { addPinToMessage: MessageGraphQL },
      MessageGraphQL
    >("addPinToMessage", addPinToMessage, "_mutation() -> pinMessage()", {
      messageId: id,
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversation ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async addReaction(reaction: string): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async addReactionToMessage(
    args: AddReactionToMessageArgs
  ): Promise<Message | QIError> {
    const response = await this._mutation<
      MutationAddReactionToMessageArgs,
      { addReactionToMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "addReactionToMessage",
      addReactionToMessage,
      "_mutation() -> addReactionToMessage()",
      {
        input: {
          messageId: args.messageId,
          reactionContent: args.reaction,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversation ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async addConversationReport(
    description: string
  ): Promise<QIError | ConversationReport> {
    throw new Error("Method not implemented.")
  }

  async addReportToConversation(
    args: AddReportToConversationArgs
  ): Promise<QIError | ConversationReport> {
    const response = await this._mutation<
      MutationAddReportToConversationArgs,
      { addReportToConversation: ConversationReportGraphQL },
      ConversationReportGraphQL
    >(
      "addReportToConversation",
      addReportToConversation,
      "_mutation() -> addReportToConversation()",
      {
        input: {
          conversationId: args.id,
          description: args.description,
        },
      }
    )

    if (response instanceof QIError) return response

    return new ConversationReport({
      ...this._parentConfig!,
      id: response.id,
      description: response.description ? response.description : null,
      userId: response.userId ? response.userId : null,
      createdAt: response.createdAt,
      client: this._client!,
    })
  }

  async addMessageReport(
    description: string
  ): Promise<QIError | MessageReport> {
    throw new Error("Method not implemented.")
  }

  async addReportToMessage(
    args: AddReportToMessageArgs
  ): Promise<QIError | MessageReport> {
    const response = await this._mutation<
      MutationAddReportToMessageArgs,
      { addReportToMessage: MessageReportGraphQL },
      MessageReportGraphQL
    >(
      "addReportToMessage",
      addReportToMessage,
      "_mutation() -> addReportToMessage()",
      {
        input: {
          messageId: args.id,
          description: args.description,
        },
      }
    )

    if (response instanceof QIError) return response

    return new MessageReport({
      ...this._parentConfig!,
      id: response.id,
      description: response.description,
      userId: response.userId ? response.userId : null,
      createdAt: response.createdAt,
      client: this._client!,
    })
  }

  async archiveConversation(): Promise<Conversation | QIError>
  async archiveConversation(id: string): Promise<Conversation | QIError>
  async archiveConversation(id?: unknown): Promise<Conversation | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use archiveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationArchiveConversationArgs,
      { archiveConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "archiveConversation",
      archiveConversation,
      "_mutation() -> archiveConversation()",
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

  async archiveConversations(
    ids: Array<string>
  ): Promise<
    { concatConversationIds: string; items: Array<{ id: string }> } | QIError
  > {
    const response = await this._mutation<
      MutationArchiveConversationsArgs,
      { archiveConversations: ArchiveConversationsBatchResultGraphQL },
      ArchiveConversationsBatchResultGraphQL
    >(
      "archiveConversations",
      archiveConversations,
      "_mutation() -> archiveConversations()",
      {
        conversationIds: ids,
      }
    )

    if (response instanceof QIError) return response

    return {
      concatConversationIds: response.concatConversationIds,
      items: response.items,
    }
  }

  async createConversationGroup(
    args: CreateConversationGroupArgs
  ): Promise<Conversation | QIError> {
    const response = await this._mutation<
      MutationCreateConversationGroupArgs,
      { createConversationGroup: ConversationGraphQL },
      ConversationGraphQL
    >(
      "createConversationGroup",
      createConversationGroup,
      "_mutation() -> createConversationGroup()",
      {
        input: {
          name: args.name,
          description: args.description,
          bannerImageURL: args.bannerImageURL,
          imageURL: args.imageURL,
        },
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

  async createConversationOneToOne(
    args: CreateConversationOneToOneArgs
  ): Promise<QIError | Conversation> {
    const response = await this._mutation<
      MutationCreateConversationOneToOneArgs,
      { createConversationOneToOne: ConversationGraphQL },
      ConversationGraphQL
    >(
      "createConversationOneToOne",
      createConversationOneToOne,
      "_mutation() -> createConversationOneToOne()",
      {
        input: {
          name: args.name,
          description: args.description,
          bannerImageURL: args.bannerImageURL,
          imageURL: args.imageURL,
        },
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

  async deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs
  ): Promise<Boolean | QIError> {
    const response = await this._mutation<
      MutationDeleteBatchConversationMessagesArgs,
      { deleteBatchConversationMessages: Boolean },
      Boolean
    >(
      "deleteBatchConversationMessages",
      deleteBatchConversationMessages,
      "_mutation() -> deleteBatchConversationMessages()",
      {
        input: {
          conversationId: args.id,
          messagesIds: args.messagesIds,
        },
      }
    )

    if (response instanceof QIError) return response

    return true
  }

  async deleteMessage(id: string): Promise<Message | QIError> {
    const response = await this._mutation<
      MutationDeleteConversationMessageArgs,
      { deleteConversationMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "deleteConversationMessage",
      deleteConversationMessage,
      "_mutation() -> deleteMessage()",
      {
        input: {
          messageId: id,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversation ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async deleteRequestTrade(
    id: string
  ): Promise<ConversationTradingPool | QIError> {
    const response = await this._mutation<
      MutationDeleteRequestTradeArgs,
      { deleteRequestTrade: ConversationTradingPoolGraphQL },
      ConversationTradingPoolGraphQL
    >(
      "deleteRequestTrade",
      deleteRequestTrade,
      "_mutation() -> deleteRequestTrade()",
      {
        requestTradeId: id,
      }
    )

    if (response instanceof QIError) return response

    return new ConversationTradingPool({
      ...this._parentConfig!,
      id: response.id,
      conversationId: response.conversationId ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      creatorsIds: response.creatorsIds ? response.creatorsIds : null,
      initializatorsIds: response.initializatorsIds
        ? response.initializatorsIds
        : null,
      operation: response.operation ? JSON.parse(response.operation) : null,
      status: response.status ? response.status : null,
      type: response.type ? response.type : null,
      createdAt: response.createdAt ? response.createdAt : null,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async editMessage(args: EditMessageArgs): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationEditMessageArgs,
      { editMessage: MessageGraphQL },
      MessageGraphQL
    >("editMessage", editMessage, "_mutation() -> editMessage()", {
      input: {
        messageId: args.id,
        content: args.content,
      },
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversation ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async ejectMember(args: EjectMemberArgs): Promise<QIError | Conversation> {
    const response = await this._mutation<
      MutationEjectMemberArgs,
      { ejectMember: ConversationGraphQL },
      ConversationGraphQL
    >("ejectMember", ejectMember, "_mutation() -> ejectMember()", {
      input: {
        conversationId: args.id,
        userId: args.userId,
      },
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

  async eraseConversationByAdmin(
    id: string
  ): Promise<
    { conversationId: string; items: Array<{ id: string }> } | QIError
  > {
    const response = await this._query<
      MutationEraseConversationByAdminArgs,
      { eraseConversationByAdmin: EraseConversationByAdminBatchResultGraphQL },
      EraseConversationByAdminBatchResultGraphQL
    >(
      "eraseConversationByAdmin",
      eraseConversationByAdmin,
      "_mutation() -> eraseConversationByAdmin()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    const listConversations: {
      conversationId: string
      items: Array<{ id: string }>
    } = {
      conversationId: response.conversationId,
      items: response.items,
    }

    return listConversations
  }

  async leaveConversation(): Promise<Conversation | QIError>
  async leaveConversation(id: string): Promise<Conversation | QIError>
  async leaveConversation(id?: unknown): Promise<Conversation | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use leaveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationLeaveConversationArgs,
      { leaveConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "leaveConversation",
      leaveConversation,
      "_mutation() -> leaveConversation()",
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

  async muteConversation(
    duration: "EIGHT_HOURS" | "ONE_DAY" | "ONE_WEEK" | "FOREVER"
  ): Promise<QIError | Conversation>
  async muteConversation(
    args: MuteConversationArgs
  ): Promise<QIError | Conversation>
  async muteConversation(args: unknown): Promise<Conversation | QIError> {
    if (!args) {
      throw new Error(
        "args argument can not be null or undefined. Consider to use muteConversation(args: MuteConversationArgs) instead."
      )
    } else {
      const response = await this._mutation<
        MutationMuteConversationArgs,
        { muteConversation: ConversationGraphQL },
        ConversationGraphQL
      >(
        "muteConversation",
        muteConversation,
        "_mutation() -> muteConversation()",
        {
          input: {
            conversationId: (args as MuteConversationArgs).id,
            duration: (args as MuteConversationArgs).duration,
          },
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

  async unlockUser(): Promise<QIError | User>
  async unlockUser(id: string): Promise<QIError | User>
  async unlockUser(id?: unknown): Promise<QIError | User> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unlockUser(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemoveBlockedUserArgs,
      { removeBlockedUser: UserGraphQL },
      UserGraphQL
    >("removeBlockedUser", removeBlockedUser, "_mutation() -> unlockUser()", {
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

  async unpinMessage(): Promise<QIError | Message>
  async unpinMessage(id: string): Promise<QIError | Message>
  async unpinMessage(id?: unknown): Promise<QIError | Message> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unpinMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemovePinFromMessageArgs,
      { removePinFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removePinFromMessage",
      removePinFromMessage,
      "_mutation() -> unpinMessage()",
      {
        messageId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversation ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
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
