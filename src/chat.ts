import {
  Engine,
  User,
  Conversation,
  QIError,
  Message,
  ConversationReport,
  MessageReport,
  ConversationTradingPool,
  MessageImportant,
  ConversationPin,
  Crypto,
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
  UserSubscriptionEngine,
} from "./interfaces/chat/core/user"
import {
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
  MutationRemoveReactionFromMessageArgs,
  MutationRequestTradeArgs,
  MutationSendMessageArgs,
  MutationUnarchiveConversationArgs,
  MutationUnarchiveConversationsArgs,
  MutationUnmuteConversationArgs,
  MutationUpdateConversationGroupArgs,
  MutationUpdateUserInfoArgs,
  QueryListAllActiveUserConversationIdsArgs,
  ListAllActiveUserConversationIdsResult as ListAllActiveUserConversationIdsResultGraphQL,
  QueryListConversationsByIdsArgs,
  ListConversationsByIdsResult as ListConversationsByIdsResultGraphQL,
  QueryListMessagesByConversationIdArgs,
  ListMessagesByConversationIdResult as ListMessagesByConversationIdResultGraphQL,
  QueryFindUsersByUsernameOrAddressArgs,
  FindUsersByUsernameOrAddressResult as FindUsersByUsernameOrAddressResultGraphQL,
  MutationAddImportantToMessageArgs,
  MutationRemoveImportantFromMessageArgs,
  MutationAddPinToConversationArgs,
  MutationRemovePinFromConversationArgs,
  SubscriptionOnSendMessageArgs,
  SubscriptionOnEditMessageArgs,
  SubscriptionOnDeleteMessageArgs,
  SubscriptionOnRemoveReactionArgs,
  SubscriptionOnAddReactionArgs,
  SubscriptionOnAddPinMessageArgs,
  SubscriptionOnRemovePinMessageArgs,
  SubscriptionOnUpdateConversationGroupArgs,
  SubscriptionOnEjectMemberArgs,
  SubscriptionOnLeaveConversationArgs,
  SubscriptionOnAddPinConversationArgs,
  SubscriptionOnRemovePinConversationArgs,
  SubscriptionOnMuteConversationArgs,
  SubscriptionOnUpdateUserArgs,
  SubscriptionOnRequestTradeArgs,
  SubscriptionOnDeleteRequestTradeArgs,
  SubscriptionOnAddMembersToConversationArgs,
  QueryListMessagesImportantByUserConversationIdArgs,
  ListMessagesImportantByUserConversationIdResult as ListMessagesImportantByUserConversationIdResultGraphQL,
  QueryListConversationsPinnedByCurrentUserArgs,
  ListConversationsPinnedByUserIdResult as ListConversationsPinnedByUserIdResultGraphQL,
  QueryListConversationMemberByUserIdArgs,
  ListConversationMemberByUserIdResult as ListConversationMemberByUserIdResultGraphQL,
  SubscriptionOnUnmuteConversationArgs,
  MutationAddMemberToConversationArgs,
  AddMemberToConversationResult as AddMemberToConversationResultGraphQL,
  SubscriptionOnAddMemberToConversationArgs,
  BatchDeleteMessagesResult as BatchDeleteMessagesResultGraphQL,
  SubscriptionOnBatchDeleteMessagesArgs,
} from "./graphql/generated/graphql"
import {
  addBlockedUser,
  addImportantToMessage,
  addMembersToConversation,
  addPinToConversation,
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
  removeImportantFromMessage,
  removePinFromConversation,
  removePinFromMessage,
  removeReactionFromMessage,
  requestTrade,
  sendMessage,
  unarchiveConversation,
  unarchiveConversations,
  unmuteConversation,
  updateConversationGroup,
  updateUserInfo,
} from "./constants/chat/mutations"
import {
  findUsersByUsernameOrAddress,
  getConversationById,
  getCurrentUser,
  listAllActiveUserConversationIds,
  listConversationsByIds,
  listConversationsPinnedByCurrentUser,
  listMessagesByConversationId,
  listMessagesImportantByUserConversationId,
  listConversationMemberByUserId,
} from "./constants/chat/queries"
import { ConversationMember } from "./core/chat/conversationmember"
import {
  AddReactionToMessageArgs,
  AddReportToConversationArgs,
  AddReportToMessageArgs,
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
  EditMessageArgs,
  FindUsersByUsernameOrAddressArgs,
  ListAllActiveUserConversationIdsArgs,
  ListMessagesByConversationIdArgs,
  ListMessagesImportantByUserConversationIdArgs,
  MuteConversationArgs,
  RemoveReactionFromMessageArgs,
  RequestTradeArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
  UpdateUserArgs,
  AddMembersToConversationArgs,
  EjectMemberArgs,
  AddMemberToConversationArgs,
} from "./types/chat/schema/args"
import { UAMutationEngine, UAQueryEngine } from "./interfaces/chat/core/ua"
import { Maybe } from "./types/base"
import {
  onDeleteMessage,
  onEditMessage,
  onSendMessage,
  onRemoveReaction,
  onAddReaction,
  onAddPinMessage,
  onRemovePinMessage,
  onUpdateConversationGroup,
  onEjectMember,
  onLeaveConversation,
  onAddPinConversation,
  onRemovePinConversation,
  onMuteConversation,
  onUnmuteConversation,
  onUpdateUser,
  onRequestTrade,
  onDeleteRequestTrade,
  onAddMembersToConversation,
  onAddMemberToConversation,
  onBatchDeleteMessages,
} from "./constants/chat/subscriptions"
import { OperationResult } from "@urql/core"
import { SubscriptionGarbage } from "./types/chat/subscriptiongarbage"
import { KeyPairItem } from "./types/chat/keypairitem"
import { ActiveUserConversationType } from "./enums"
import { WebConversation, WebUser } from "./interfaces/app/core/database"
import { Account, Converter, findAddedAndRemovedConversation } from "./core"
import Dexie from "dexie"
import { Reaction } from "./core/chat/reaction"

export class Chat
  extends Engine
  implements
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
    UAMutationEngine,
    UAQueryEngine
{
  private _isSyncing: boolean = false

  private _syncingCounter: number = 0

  private _eventsCallback: Array<{
    event: "sync" | "syncing" | "syncError" | "syncUpdate"
    callbacks: Array<Function>
  }> = []

  private _account: Maybe<Account> = null

  private _unsubscribeSyncSet: Array<{
    type:
      | "onAddMemberToConversation"
      | "onAddReaction"
      | "onSendMessage"
      | "onEditMessage"
      | "onEjectMember"
      | "onLeaveConversation"
      | "onMuteConversation"
      | "onUnmuteConversation"
      | "onDeleteMessage"
      | "onAddReaction"
      | "onRemoveReaction"
      | "onBatchDeleteMessages"
      | "onUpdateConversationGroup"

    unsubscribe: Function
    uuid: string
    conversationId: string
  }> = []

  private _conversationsMap: Array<{
    type: "CANCELED" | "ACTIVE"
    conversationId: string
    conversation: Conversation
  }> = []

  static readonly SYNCING_TIME = 60000

  private _emit(
    event: "sync" | "syncing" | "syncError" | "syncUpdate",
    args?: any
  ) {
    const index = this._eventsCallback.findIndex((item) => {
      return item.event === event
    })

    if (index > -1)
      this,
        this._eventsCallback[index].callbacks.forEach((callback) => {
          callback(args)
        })
  }

  private _on(
    event: "sync" | "syncing" | "syncError" | "syncUpdate",
    callback: Function
  ) {
    const index = this._eventsCallback.findIndex((item) => {
      return item.event === event
    })

    if (index > -1) this._eventsCallback[index].callbacks.push(callback)
    else
      this._eventsCallback.push({
        event,
        callbacks: [callback],
      })
  }

  private _off(event: "sync" | "syncing" | "syncError" | "syncUpdate") {
    const index = this._eventsCallback.findIndex((item) => {
      return item.event === event
    })

    if (index > -1) this._eventsCallback[index].callbacks = []
  }

  setCurrentAccount(account: Account) {
    this._account = account
  }

  /**
   * Blocks a user by their ID.
   * @param {string} [id] - The ID of the user to block.
   * @returns {Promise<User | QIError>} A promise that resolves to a User object if successful, or a QIError object if there was an error.
   */
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
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
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
          members: (args as AddMembersToConversationArgs).members,
        },
      }
    )

    if (response instanceof QIError) return response

    const listConversationMembers: {
      conversationId: string
      items: Array<ConversationMember>
    } = {
      conversationId: response.conversationId,
      items: response.items.map((item) => {
        return new ConversationMember({
          ...this._parentConfig!,
          id: item.id,
          conversationId: item.conversationId,
          userId: item.userId,
          type: item.type,
          encryptedConversationPublicKey: item.encryptedConversationPublicKey,
          encryptedConversationPrivateKey: item.encryptedConversationPrivateKey,
          createdAt: item.createdAt,
          client: this._client!,
        })
      }),
    }

    return listConversationMembers
  }

  async addMemberToConversation(
    args: AddMemberToConversationArgs
  ): Promise<ConversationMember | QIError> {
    const response = await this._query<
      MutationAddMemberToConversationArgs,
      { addMemberToConversation: AddMemberToConversationResultGraphQL },
      AddMemberToConversationResultGraphQL
    >(
      "addMembersToConversation",
      addMembersToConversation,
      "_mutation() -> addMembersToConversation()",
      {
        input: {
          conversationId: (args as AddMemberToConversationArgs).id,
          member: (args as AddMemberToConversationArgs).member,
        },
      }
    )

    if (response instanceof QIError) return response

    return new ConversationMember({
      ...this._parentConfig!,
      id: response.item.id,
      conversationId: response.item.conversationId,
      userId: response.item.userId,
      type: response.item.type,
      encryptedConversationPublicKey:
        response.item.encryptedConversationPublicKey,
      encryptedConversationPrivateKey:
        response.item.encryptedConversationPrivateKey,
      createdAt: response.item.createdAt,
      client: this._client!,
    })
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
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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
          reactionContent: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.reaction
          ),
          conversationId: args.conversationId,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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

  async archiveConversation(): Promise<User | QIError>
  async archiveConversation(id: string): Promise<User | QIError>
  async archiveConversation(id?: unknown): Promise<User | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use archiveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationArchiveConversationArgs,
      { archiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "archiveConversation",
      archiveConversation,
      "_mutation() -> archiveConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  async archiveConversations(ids: Array<string>): Promise<User | QIError> {
    const response = await this._mutation<
      MutationArchiveConversationsArgs,
      { archiveConversations: UserGraphQL },
      UserGraphQL
    >(
      "archiveConversations",
      archiveConversations,
      "_mutation() -> archiveConversations()",
      {
        conversationIds: ids,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  async createConversationGroup(
    args: CreateConversationGroupArgs
  ): Promise<
    { keypairItem: KeyPairItem | null; conversation: Conversation } | QIError
  > {
    const keypair = await Crypto.generateKeys("HIGH")
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
          name: Crypto.encrypt(keypair!.publicKey, args.name),
          description: Crypto.encrypt(keypair!.publicKey, args.description),
          bannerImageURL: Crypto.encrypt(
            keypair!.publicKey,
            args.bannerImageURL
          ),
          imageURL: Crypto.encrypt(keypair!.publicKey, args.imageURL),
        },
      }
    )

    if (response instanceof QIError) return response

    this.addKeyPairItem({
      id: response.id,
      keypair: keypair!,
    })

    const conversationGroup: {
      keypairItem: KeyPairItem
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        keypair: keypair!,
      },
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.id,
        name: response.name,
        description: response.description ? response.description : null,
        imageURL: response.imageURL ? response.imageURL : null,
        bannerImageURL: response.bannerImageURL
          ? response.bannerImageURL
          : null,
        settings: response.settings ? response.settings : null,
        membersIds: response.membersIds ? response.membersIds : null,
        mutedBy: response.mutedBy ? response.mutedBy : null,
        type: response.type,
        lastMessageSentAt: response.lastMessageSentAt
          ? response.lastMessageSentAt
          : null,
        ownerId: response.ownerId ? response.ownerId : null,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt ? response.updatedAt : null,
        deletedAt: response.deletedAt ? response.deletedAt : null,
        client: this._client!,
      }),
    }

    return conversationGroup
  }

  async createConversationOneToOne(
    args: CreateConversationOneToOneArgs
  ): Promise<
    QIError | { keypairItem: KeyPairItem | null; conversation: Conversation }
  > {
    const keypair = await Crypto.generateKeys("HIGH")
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
          name: Crypto.encrypt(keypair!.publicKey, args.name),
          description: Crypto.encrypt(keypair!.publicKey, args.description),
          bannerImageURL: Crypto.encrypt(
            keypair!.publicKey,
            args.bannerImageURL
          ),
          imageURL: Crypto.encrypt(keypair!.publicKey, args.imageURL),
        },
      }
    )

    if (response instanceof QIError) return response

    const conversationItem: {
      keypairItem: KeyPairItem | null
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        keypair: keypair!,
      },
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.id,
        name: response.name,
        description: response.description ? response.description : null,
        imageURL: response.imageURL ? response.imageURL : null,
        bannerImageURL: response.bannerImageURL
          ? response.bannerImageURL
          : null,
        settings: response.settings ? response.settings : null,
        membersIds: response.membersIds ? response.membersIds : null,
        mutedBy: response.mutedBy ? response.mutedBy : null,
        type: response.type,
        lastMessageSentAt: response.lastMessageSentAt
          ? response.lastMessageSentAt
          : null,
        ownerId: response.ownerId ? response.ownerId : null,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt ? response.updatedAt : null,
        deletedAt: response.deletedAt ? response.deletedAt : null,
        client: this._client!,
      }),
    }

    return conversationItem
  }

  async deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs
  ): Promise<{ conversationId: string; messagesIds: string[] } | QIError> {
    const response = await this._mutation<
      MutationDeleteBatchConversationMessagesArgs,
      { deleteBatchConversationMessages: BatchDeleteMessagesResultGraphQL },
      BatchDeleteMessagesResultGraphQL
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

    return {
      conversationId: response.conversationId,
      messagesIds: response.messagesIds,
    }
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
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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
      operation: response.operation ? response.operation : null,
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
        content: Crypto.encryptStringOrFail(
          this.findPublicKeyById(args.conversationId),
          args.content
        ),
        conversationId: args.conversationId,
      },
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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
    args: MuteConversationArgs
  ): Promise<QIError | Conversation>
  async muteConversation(args: unknown): Promise<Conversation | QIError> {
    const response = await this._mutation<
      MutationMuteConversationArgs,
      { muteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "muteConversation",
      muteConversation,
      "_mutation() -> muteConversation()",
      {
        conversationId: (args as MuteConversationArgs).id,
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
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
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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

  async removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs
  ): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationRemoveReactionFromMessageArgs,
      { removeReactionFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removeReactionFromMessage",
      removeReactionFromMessage,
      "_mutation() -> removeReactionFromMessage()",
      {
        input: {
          reactionContent: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.reaction
          ),
          messageId: args.messageId,
          conversationId: args.conversationId,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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

  async requestTrade(
    args: RequestTradeArgs
  ): Promise<QIError | ConversationTradingPool> {
    const response = await this._mutation<
      MutationRequestTradeArgs,
      { requestTrade: ConversationTradingPoolGraphQL },
      ConversationTradingPoolGraphQL
    >("requestTrade", requestTrade, "_mutation() -> requestTrade()", {
      input: {
        creatorsIds: args.creatorsIds,
        initializatorIds: args.initializatorIds,
        conversationId: args.conversationId,
        operation: Crypto.encryptStringOrFail(
          this.findPublicKeyById(args.conversationId),
          JSON.stringify(args.operation)
        ),
      },
    })

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
      operation: response.operation ? response.operation : null,
      status: response.status ? response.status : null,
      type: response.type ? response.type : null,
      createdAt: response.createdAt ? response.createdAt : null,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async sendMessage(args: SendMessageArgs): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationSendMessageArgs,
      { sendMessage: MessageGraphQL },
      MessageGraphQL
    >("sendMessage", sendMessage, "_mutation() -> sendMessage()", {
      input: {
        content: Crypto.encryptStringOrFail(
          this.findPublicKeyById((args as SendMessageArgs).conversationId),
          (args as SendMessageArgs).content
        ),
        conversationId: (args as SendMessageArgs).conversationId,
        type: (args as SendMessageArgs).type,
      },
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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

  async unarchiveConversation(): Promise<QIError | User>
  async unarchiveConversation(id: string): Promise<QIError | User>
  async unarchiveConversation(id?: unknown): Promise<QIError | User> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unarchiveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationUnarchiveConversationArgs,
      { unarchiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "unarchiveConversation",
      unarchiveConversation,
      "_mutation() -> unarchiveConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  async unarchiveConversations(ids: Array<string>): Promise<User | QIError> {
    const response = await this._mutation<
      MutationUnarchiveConversationsArgs,
      { unarchiveConversations: UserGraphQL },
      UserGraphQL
    >(
      "unarchiveConversations",
      unarchiveConversations,
      "_mutation() -> unarchiveConversations()",
      {
        conversationIds: ids,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  async unmuteConversation(): Promise<QIError | Conversation>
  async unmuteConversation(id: string): Promise<QIError | Conversation>
  async unmuteConversation(id?: unknown): Promise<QIError | Conversation> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unmuteConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationUnmuteConversationArgs,
      { unmuteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "unmuteConversation",
      unmuteConversation,
      "_mutation() -> unmuteConversation()",
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
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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

  async updateConversationGroup(
    args: UpdateConversationGroupInputArgs
  ): Promise<QIError | Conversation> {
    const response = await this._mutation<
      MutationUpdateConversationGroupArgs,
      { updateConversationGroup: ConversationGraphQL },
      ConversationGraphQL
    >(
      "updateConversationGroup",
      updateConversationGroup,
      "_mutation() -> updateConversationGroup()",
      {
        input: {
          conversationId: args.conversationId,
          description: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.description
          ),
          imageURL: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            new URL(args.imageURL).toString()
          ),
          bannerImageURL: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            new URL(args.bannerImageURL).toString()
          ),
          name: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.name
          ),
          settings: JSON.stringify(args.settings),
        },
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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

  async updateUser(args: UpdateUserArgs): Promise<QIError | User> {
    const response = await this._mutation<
      MutationUpdateUserInfoArgs,
      { updateUserInfo: UserGraphQL },
      UserGraphQL
    >("updateUserInfo", updateUserInfo, "_mutation() -> updateUser()", {
      input: {
        allowNotification: args.allowNotification,
        allowNotificationSound: args.allowNotificationSound,
        visibility: args.visibility,
        onlineStatus: args.onlineStatus,
        allowReadReceipt: args.allowReadReceipt
          ? args.allowReadReceipt
          : undefined,
        allowReceiveMessageFrom: args.allowReceiveMessageFrom,
        allowAddToGroupsFrom: args.allowAddToGroupsFrom,
        allowGroupsSuggestion: args.allowGroupsSuggestion,
      },
    })

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
  }

  async markImportantMessage(): Promise<Message | QIError>
  async markImportantMessage(id: string): Promise<Message | QIError>
  async markImportantMessage(id?: unknown): Promise<Message | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use markImportantMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddImportantToMessageArgs,
      { addImportantToMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "addImportantToMessage",
      addImportantToMessage,
      "_mutation() -> markImportantMessage()",
      {
        messageId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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

  async unmarkImportantMessage(): Promise<QIError | Message>
  async unmarkImportantMessage(id: string): Promise<QIError | Message>
  async unmarkImportantMessage(id?: unknown): Promise<QIError | Message> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unmarkImportantMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemoveImportantFromMessageArgs,
      { removeImportantFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removeImportantFromMessage",
      removeImportantFromMessage,
      "_mutation() -> removeImportantFromMessage()",
      {
        messageId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
          })
        : null,
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

  async pinConversation(): Promise<Conversation | QIError>
  async pinConversation(id: string): Promise<Conversation | QIError>
  async pinConversation(id?: unknown): Promise<Conversation | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use pinConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddPinToConversationArgs,
      { addPinToConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "addPinToConversation",
      addPinToConversation,
      "_mutation() -> pinConversation()",
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
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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

  async unpinConversation(): Promise<QIError | Conversation>
  async unpinConversation(id: string): Promise<QIError | Conversation>
  async unpinConversation(id?: unknown): Promise<QIError | Conversation> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unpinConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemovePinFromConversationArgs,
      { removePinFromConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "removePinFromConversation",
      removePinFromConversation,
      "_mutation() -> unpinConversation()",
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
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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

  /*
    Query
  */

  async listAllActiveUserConversationIds(
    args: ListAllActiveUserConversationIdsArgs
  ): Promise<QIError | { items: string[]; nextToken?: string | undefined }> {
    const response = await this._query<
      QueryListAllActiveUserConversationIdsArgs,
      {
        listAllActiveUserConversationIds: ListAllActiveUserConversationIdsResultGraphQL
      },
      ListAllActiveUserConversationIdsResultGraphQL
    >(
      "listAllActiveUserConversationIds",
      listAllActiveUserConversationIds,
      "_query() -> listAllActiveUserConversationIds()",
      {
        input: {
          type: args.type,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const activeUserConversationIds = {
      items: response.items,
      nextToken: response.nextToken ? response.nextToken : undefined,
    }

    return activeUserConversationIds
  }

  async listConversationMemberByUserId(
    nextToken?: string | undefined
  ): Promise<
    | QIError
    | { items: ConversationMember[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListConversationMemberByUserIdArgs,
      {
        listConversationMemberByUserId: ListConversationMemberByUserIdResultGraphQL
      },
      ListConversationMemberByUserIdResultGraphQL
    >(
      "listConversationMemberByUserId",
      listConversationMemberByUserId,
      "_query() -> listConversationMemberByUserId()",
      {
        nextToken,
      }
    )

    if (response instanceof QIError) return response

    const listConversationMember: {
      nextToken?: string
      items: Array<ConversationMember>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new ConversationMember({
          ...this._parentConfig!,
          id: item.id,
          conversationId: item.conversationId,
          userId: item.userId,
          type: item.type,
          encryptedConversationPrivateKey: item.encryptedConversationPrivateKey,
          encryptedConversationPublicKey: item.encryptedConversationPublicKey,
          createdAt: item.createdAt,
          client: this._client!,
        })
      }),
    }

    return listConversationMember
  }

  async listConversationsByIds(ids: string[]): Promise<
    | QIError
    | {
        items: Conversation[]
        unprocessedKeys?: Maybe<string[]> | undefined
      }
  > {
    const response = await this._query<
      QueryListConversationsByIdsArgs,
      { listConversationsByIds: ListConversationsByIdsResultGraphQL },
      ListConversationsByIdsResultGraphQL
    >(
      "listConversationsByIds",
      listConversationsByIds,
      "_query() -> listConversationsByIds()",
      { conversationsIds: ids }
    )

    if (response instanceof QIError) return response

    const listConversations: {
      unprocessedKeys?: Maybe<string[]>
      items: Array<Conversation>
    } = {
      unprocessedKeys: response.unprocessedKeys,
      items: response.items.map((item) => {
        return new Conversation({
          ...this._parentConfig!,
          id: item.id,
          name: item.name,
          description: item.description ? item.description : null,
          imageURL: item.imageURL ? item.imageURL : null,
          bannerImageURL: item.bannerImageURL ? item.bannerImageURL : null,
          settings: item.settings ? item.settings : null,
          membersIds: item.membersIds ? item.membersIds : null,
          mutedBy: item.mutedBy ? item.mutedBy : null,
          type: item.type,
          lastMessageSentAt: item.lastMessageSentAt
            ? item.lastMessageSentAt
            : null,
          ownerId: item.ownerId ? item.ownerId : null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
        })
      }),
    }

    return listConversations
  }

  async listMessagesByConversationId(
    args: ListMessagesByConversationIdArgs
  ): Promise<
    QIError | { items: Message[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListMessagesByConversationIdArgs,
      { listConversationsByIds: ListMessagesByConversationIdResultGraphQL },
      ListMessagesByConversationIdResultGraphQL
    >(
      "listMessagesByConversationId",
      listMessagesByConversationId,
      "_query() -> listMessagesByConversationId()",
      {
        input: {
          conversationId: args.id,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listMessages: {
      nextToken?: string
      items: Array<Message>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new Message({
          ...this._parentConfig!,
          id: item.id,
          content: item.content,
          conversationId: item.conversationId,
          reactions: item.reactions
            ? item.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: item.userId,
          messageRoot: item.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: item.messageRoot.id,
                content: item.messageRoot.content,
                conversationId: item.messageRoot.conversationId,
                reactions: item.messageRoot.reactions
                  ? item.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: item.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: item.messageRoot.type
                  ? (item.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: item.messageRoot.createdAt,
                updatedAt: item.messageRoot.updatedAt
                  ? item.messageRoot.updatedAt
                  : null,
                deletedAt: item.messageRoot.deletedAt
                  ? item.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          messageRootId: item.messageRootId ? item.messageRootId : null,
          type: item.type
            ? (item.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
        })
      }),
    }

    return listMessages
  }

  async listMessagesImportantByUserConversationId(
    args: ListMessagesImportantByUserConversationIdArgs
  ): Promise<
    | {
        items: MessageImportant[]
        nextToken?: Maybe<string> | undefined
      }
    | QIError
  > {
    const response = await this._query<
      QueryListMessagesImportantByUserConversationIdArgs,
      {
        listMessagesImportantByUserConversationId: ListMessagesImportantByUserConversationIdResultGraphQL
      },
      ListMessagesImportantByUserConversationIdResultGraphQL
    >(
      "listMessagesImportantByUserConversationId",
      listMessagesImportantByUserConversationId,
      "_query() -> listMessagesImportantByUserConversationId()",
      {
        input: {
          conversationId: args.conversationId,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listMessagesImportant: {
      nextToken?: string
      items: Array<MessageImportant>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new MessageImportant({
          ...this._parentConfig!,
          id: item.id,
          userId: item.userId,
          messageId: item.messageId,
          message: new Message({
            ...this._parentConfig!,
            id: item.message!.id,
            content: item.message!.content,
            conversationId: item.message!.conversationId,
            reactions: item.message!.reactions
              ? item.message!.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                  })
                })
              : null,
            userId: item.message!.userId,
            messageRoot: item.message!.messageRoot
              ? new Message({
                  ...this._parentConfig!,
                  id: item.message!.messageRoot.id,
                  content: item.message!.messageRoot.content,
                  conversationId: item.message!.messageRoot.conversationId,
                  reactions: item.message!.messageRoot.reactions
                    ? item.message!.messageRoot.reactions.map((reaction) => {
                        return new Reaction({
                          ...this._parentConfig!,
                          userId: reaction.userId,
                          content: reaction.content,
                          createdAt: reaction.createdAt,
                          client: this._client!,
                        })
                      })
                    : null,
                  userId: item.message!.messageRoot.userId,
                  messageRoot: null,
                  messageRootId: null,
                  type: item.message!.messageRoot.type
                    ? (item.message!.messageRoot.type as
                        | "TEXTUAL"
                        | "ATTACHMENT"
                        | "SWAP_PROPOSAL"
                        | "RENT")
                    : null,
                  createdAt: item.message!.messageRoot.createdAt,
                  updatedAt: item.message!.messageRoot.updatedAt
                    ? item.message!.messageRoot.updatedAt
                    : null,
                  deletedAt: item.message!.messageRoot.deletedAt
                    ? item.message!.messageRoot.deletedAt
                    : null,
                  client: this._client!,
                })
              : null,
            messageRootId: item.message!.messageRootId
              ? item.message!.messageRootId
              : null,
            type: item.message!.type
              ? (item.message!.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "SWAP_PROPOSAL"
                  | "RENT")
              : null,
            createdAt: item.message!.createdAt,
            updatedAt: item.message!.updatedAt ? item.message!.updatedAt : null,
            deletedAt: item.message!.deletedAt ? item.message!.deletedAt : null,
            client: this._client!,
          }),
          conversationId: item.conversationId,
          createdAt: item.createdAt,
          client: this._client!,
        })
      }),
    }

    return listMessagesImportant
  }

  async listConversationsPinnedByCurrentUser(
    nextToken?: string | undefined
  ): Promise<
    | QIError
    | { items: ConversationPin[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListConversationsPinnedByCurrentUserArgs,
      {
        listConversationsPinnedByCurrentUser: ListConversationsPinnedByUserIdResultGraphQL
      },
      ListConversationsPinnedByUserIdResultGraphQL
    >(
      "listConversationsPinnedByCurrentUser",
      listConversationsPinnedByCurrentUser,
      "_query() -> listConversationsPinnedByCurrentUser()",
      {
        nextToken,
      }
    )

    if (response instanceof QIError) return response

    const listConversationsPinned: {
      nextToken?: string
      items: Array<ConversationPin>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new ConversationPin({
          ...this._parentConfig!,
          id: item.id,
          userId: item.userId,
          conversationId: item.conversationId,
          conversation: new Conversation({
            ...this._parentConfig!,
            id: item.conversation!.id,
            name: item.conversation!.name,
            description: item.conversation!.description
              ? item.conversation!.description
              : null,
            imageURL: item.conversation!.imageURL
              ? item.conversation!.imageURL
              : null,
            bannerImageURL: item.conversation!.bannerImageURL
              ? item.conversation!.bannerImageURL
              : null,
            settings: item.conversation!.settings
              ? item.conversation!.settings
              : null,
            membersIds: item.conversation!.membersIds
              ? item.conversation!.membersIds
              : null,
            mutedBy: item.conversation!.mutedBy
              ? item.conversation!.mutedBy
              : null,
            type: item.conversation!.type,
            lastMessageSentAt: item.conversation!.lastMessageSentAt
              ? item.conversation!.lastMessageSentAt
              : null,
            ownerId: item.conversation!.ownerId
              ? item.conversation!.ownerId
              : null,
            createdAt: item.conversation!.createdAt,
            updatedAt: item.conversation!.updatedAt
              ? item.conversation!.updatedAt
              : null,
            deletedAt: item.conversation!.deletedAt
              ? item.conversation!.deletedAt
              : null,
            client: this._client!,
          }),
          createdAt: item.createdAt,
          client: this._client!,
        })
      }),
    }

    return listConversationsPinned
  }

  async findUsersByUsernameOrAddress(
    args: FindUsersByUsernameOrAddressArgs
  ): Promise<QIError | { items: User[]; nextToken?: String | undefined }> {
    const response = await this._query<
      QueryFindUsersByUsernameOrAddressArgs,
      {
        findUsersByUsernameOrAddress: FindUsersByUsernameOrAddressResultGraphQL
      },
      FindUsersByUsernameOrAddressResultGraphQL
    >(
      "findUsersByUsernameOrAddress",
      findUsersByUsernameOrAddress,
      "_query() -> findUsersByUsernameOrAddress()",
      {
        input: {
          searchTerm: args.searchTerm,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listUsers: {
      nextToken?: string
      items: Array<User>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new User({
          ...this._parentConfig!,
          id: item.id,
          username: item.username ? item.username : null,
          did: item.did,
          address: item.address,
          email: item.email ? item.email : null,
          bio: item.bio ? item.bio : null,
          avatarUrl: item.avatarUrl ? new URL(item.avatarUrl) : null,
          isVerified: item.isVerified ? item.isVerified : false,
          isNft: item.isNft ? item.isNft : false,
          blacklistIds: item.blacklistIds ? item.blacklistIds : null,
          allowNotification: item.allowNotification
            ? item.allowNotification
            : false,
          allowNotificationSound: item.allowNotificationSound
            ? item.allowNotificationSound
            : false,
          visibility: item.visibility ? item.visibility : false,
          archivedConversations: item.archivedConversations
            ? item.archivedConversations
            : null,
          onlineStatus: item.onlineStatus ? item.onlineStatus : null,
          allowReadReceipt: item.allowReadReceipt
            ? item.allowReadReceipt
            : false,
          allowReceiveMessageFrom: item.allowReceiveMessageFrom
            ? item.allowReceiveMessageFrom
            : null,
          allowAddToGroupsFrom: item.allowAddToGroupsFrom
            ? item.allowAddToGroupsFrom
            : null,
          allowGroupsSuggestion: item.allowGroupsSuggestion
            ? item.allowGroupsSuggestion
            : false,
          e2ePublicKey: item.e2ePublicKey ? item.e2ePublicKey : null,
          e2eSecret: item.e2eSecret ? item.e2eSecret : null,
          e2eSecretIV: item.e2eSecretIV ? item.e2eSecretIV : null,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
          client: this._client!,
        })
      }),
    }

    return listUsers
  }

  async getCurrentUser(): Promise<QIError | User> {
    const response = await this._query<
      null,
      {
        getCurrentUser: UserGraphQL
      },
      UserGraphQL
    >("getCurrentUser", getCurrentUser, "_query() -> getCurrentUser()", null)

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
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
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
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
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
    })
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
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
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

  /**
   * Subscriptions
   */

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
  ): SubscriptionGarbage | QIError {
    const key = "onSendMessage"
    const metasubcription = this._subscription<
      SubscriptionOnSendMessageArgs,
      { onSendMessage: MessageGraphQL }
    >(onSendMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onSendMessage: MessageGraphQL },
        MessageGraphQL
      >("onSendMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onEditMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onEditMessage: MessageGraphQL },
        SubscriptionOnEditMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onEditMessage"
    const metasubcription = this._subscription<
      SubscriptionOnEditMessageArgs,
      { onEditMessage: MessageGraphQL }
    >(onEditMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onEditMessage: MessageGraphQL },
        MessageGraphQL
      >("onEditMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onBatchDeleteMessages(
    conversationId: string,
    callback: (
      response: QIError | { conversationId: string; messagesIds: string[] },
      source: OperationResult<
        { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL },
        SubscriptionOnBatchDeleteMessagesArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onBatchDeleteMessages"
    const metasubcription = this._subscription<
      SubscriptionOnBatchDeleteMessagesArgs,
      { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL }
    >(onBatchDeleteMessages, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL },
        BatchDeleteMessagesResultGraphQL
      >("onBatchDeleteMessages", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          messagesIds: r.messagesIds,
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onDeleteMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onDeleteMessage: MessageGraphQL },
        SubscriptionOnDeleteMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onDeleteMessage"
    const metasubcription = this._subscription<
      SubscriptionOnDeleteMessageArgs,
      { onDeleteMessage: MessageGraphQL }
    >(onDeleteMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onDeleteMessage: MessageGraphQL },
        MessageGraphQL
      >("onDeleteMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddReaction(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onAddReaction: MessageGraphQL },
        SubscriptionOnAddReactionArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddReaction"
    const metasubcription = this._subscription<
      SubscriptionOnAddReactionArgs,
      { onAddReaction: MessageGraphQL }
    >(onAddReaction, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddReaction: MessageGraphQL },
        MessageGraphQL
      >("onAddReaction", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRemoveReaction(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onRemoveReaction: MessageGraphQL },
        SubscriptionOnRemoveReactionArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemoveReaction"
    const metasubcription = this._subscription<
      SubscriptionOnRemoveReactionArgs,
      { onRemoveReaction: MessageGraphQL }
    >(onRemoveReaction, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemoveReaction: MessageGraphQL },
        MessageGraphQL
      >("onRemoveReaction", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddPinMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onAddPinMessage: MessageGraphQL },
        SubscriptionOnAddPinMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddPinMessage"
    const metasubcription = this._subscription<
      SubscriptionOnAddPinMessageArgs,
      { onAddPinMessage: MessageGraphQL }
    >(onAddPinMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddPinMessage: MessageGraphQL },
        MessageGraphQL
      >("onAddPinMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRemovePinMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onRemovePinMessage: MessageGraphQL },
        SubscriptionOnRemovePinMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemovePinMessage"
    const metasubcription = this._subscription<
      SubscriptionOnRemovePinMessageArgs,
      { onRemovePinMessage: MessageGraphQL }
    >(onRemovePinMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemovePinMessage: MessageGraphQL },
        MessageGraphQL
      >("onRemovePinMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                })
              })
            : null,
          userId: r.userId,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "SWAP_PROPOSAL"
                      | "RENT")
                  : null,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUpdateConversationGroup(
    id: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUpdateConversationGroup: ConversationGraphQL },
        SubscriptionOnUpdateConversationGroupArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateConversationGroup"
    const metasubcription = this._subscription<
      SubscriptionOnUpdateConversationGroupArgs,
      { onUpdateConversationGroup: ConversationGraphQL }
    >(onUpdateConversationGroup, key, { id })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateConversationGroup: ConversationGraphQL },
        ConversationGraphQL
      >("onUpdateConversationGroup", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onEjectMember(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onEjectMember: ConversationGraphQL },
        SubscriptionOnEjectMemberArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onEjectMember"
    const metasubcription = this._subscription<
      SubscriptionOnEjectMemberArgs,
      { onEjectMember: ConversationGraphQL }
    >(onEjectMember, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onEjectMember: ConversationGraphQL },
        ConversationGraphQL
      >("onEjectMember", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onLeaveConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onLeaveConversation: ConversationGraphQL },
        SubscriptionOnLeaveConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onLeaveConversation"
    const metasubcription = this._subscription<
      SubscriptionOnLeaveConversationArgs,
      { onLeaveConversation: ConversationGraphQL }
    >(onLeaveConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onLeaveConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onLeaveConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddPinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onAddPinConversation: ConversationGraphQL },
        SubscriptionOnAddPinConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddPinConversation"
    const metasubcription = this._subscription<
      SubscriptionOnAddPinConversationArgs,
      { onAddPinConversation: ConversationGraphQL }
    >(onAddPinConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddPinConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onAddPinConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRemovePinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onRemovePinConversation: ConversationGraphQL },
        SubscriptionOnRemovePinConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemovePinConversation"
    const metasubcription = this._subscription<
      SubscriptionOnRemovePinConversationArgs,
      { onRemovePinConversation: ConversationGraphQL }
    >(onRemovePinConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemovePinConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onRemovePinConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onMuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onMuteConversation: ConversationGraphQL },
        SubscriptionOnMuteConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onMuteConversation"
    const metasubcription = this._subscription<
      SubscriptionOnMuteConversationArgs,
      { onMuteConversation: ConversationGraphQL }
    >(onMuteConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onMuteConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onMuteConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUnmuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnmuteConversation: ConversationGraphQL },
        SubscriptionOnUnmuteConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUnmuteConversation"
    const metasubcription = this._subscription<
      SubscriptionOnUnmuteConversationArgs,
      { onUnmuteConversation: ConversationGraphQL }
    >(onUnmuteConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUnmuteConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onUnmuteConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddMembersToConversation(
    conversationId: string,
    callback: (
      response:
        | QIError
        | { conversationId: string; items: ConversationMember[] },
      source: OperationResult<
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        SubscriptionOnAddMembersToConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddMembersToConversation"
    const metasubcription = this._subscription<
      SubscriptionOnAddMembersToConversationArgs,
      { onAddMembersToConversation: ListConversationMembersGraphQL }
    >(onAddMembersToConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        ListConversationMembersGraphQL
      >("onAddMembersToConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          items: r.items.map((item) => {
            return new ConversationMember({
              ...this._parentConfig!,
              id: item.id,
              conversationId: item.conversationId,
              userId: item.userId,
              type: item.type,
              encryptedConversationPublicKey:
                item.encryptedConversationPublicKey,
              encryptedConversationPrivateKey:
                item.encryptedConversationPrivateKey,
              createdAt: item.createdAt,
              client: this._client!,
            })
          }),
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddMemberToConversation(
    memberId: string,
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            memberId: string
            item: ConversationMember
          },
      source: OperationResult<
        { onAddMemberToConversation: AddMemberToConversationResultGraphQL },
        SubscriptionOnAddMemberToConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddMemberToConversation"
    const metasubcription = this._subscription<
      SubscriptionOnAddMemberToConversationArgs,
      { onAddMemberToConversation: AddMemberToConversationResultGraphQL }
    >(onAddMemberToConversation, key, { memberId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddMemberToConversation: AddMemberToConversationResultGraphQL },
        AddMemberToConversationResultGraphQL
      >("onAddMemberToConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          memberId: r.memberId,
          item: new ConversationMember({
            ...this._parentConfig!,
            id: r.item.id,
            conversationId: r.item.conversationId,
            userId: r.item.userId,
            type: r.item.type,
            encryptedConversationPublicKey:
              r.item.encryptedConversationPublicKey,
            encryptedConversationPrivateKey:
              r.item.encryptedConversationPrivateKey,
            createdAt: r.item.createdAt,
            client: this._client!,
          }),
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUpdateUser(
    id: string,
    callback: (
      response: QIError | User,
      source: OperationResult<
        { onUpdateUser: UserGraphQL },
        SubscriptionOnUpdateUserArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateUser"
    const metasubcription = this._subscription<
      SubscriptionOnUpdateUserArgs,
      { onUpdateUser: UserGraphQL }
    >(onUpdateUser, key, { id })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateUser: UserGraphQL },
        UserGraphQL
      >("onUpdateUser", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new User({
          ...this._parentConfig!,
          id: r.id,
          username: r.username ? r.username : null,
          did: r.did,
          address: r.address,
          email: r.email ? r.email : null,
          bio: r.bio ? r.bio : null,
          avatarUrl: r.avatarUrl ? new URL(r.avatarUrl) : null,
          isVerified: r.isVerified ? r.isVerified : false,
          isNft: r.isNft ? r.isNft : false,
          blacklistIds: r.blacklistIds ? r.blacklistIds : null,
          allowNotification: r.allowNotification ? r.allowNotification : false,
          allowNotificationSound: r.allowNotificationSound
            ? r.allowNotificationSound
            : false,
          visibility: r.visibility ? r.visibility : false,
          archivedConversations: r.archivedConversations
            ? r.archivedConversations
            : null,
          onlineStatus: r.onlineStatus ? r.onlineStatus : null,
          allowReadReceipt: r.allowReadReceipt ? r.allowReadReceipt : false,
          allowReceiveMessageFrom: r.allowReceiveMessageFrom
            ? r.allowReceiveMessageFrom
            : null,
          allowAddToGroupsFrom: r.allowAddToGroupsFrom
            ? r.allowAddToGroupsFrom
            : null,
          allowGroupsSuggestion: r.allowGroupsSuggestion
            ? r.allowGroupsSuggestion
            : false,
          e2ePublicKey: r.e2ePublicKey ? r.e2ePublicKey : null,
          e2eSecret: r.e2eSecret ? r.e2eSecret : null,
          e2eSecretIV: r.e2eSecretIV ? r.e2eSecretIV : null,
          createdAt: new Date(r.createdAt),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRequestTrade"
    const metasubcription = this._subscription<
      SubscriptionOnRequestTradeArgs,
      { onRequestTrade: ConversationTradingPoolGraphQL }
    >(onRequestTrade, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onRequestTrade", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new ConversationTradingPool({
          ...this._parentConfig!,
          id: r.id,
          conversationId: r.conversationId ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          creatorsIds: r.creatorsIds ? r.creatorsIds : null,
          initializatorsIds: r.initializatorsIds ? r.initializatorsIds : null,
          operation: r.operation ? r.operation : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onDeleteRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnDeleteRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onDeleteRequestTrade"
    const metasubcription = this._subscription<
      SubscriptionOnDeleteRequestTradeArgs,
      { onDeleteRequestTrade: ConversationTradingPoolGraphQL }
    >(onDeleteRequestTrade, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onDeleteRequestTrade", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new ConversationTradingPool({
          ...this._parentConfig!,
          id: r.id,
          conversationId: r.conversationId ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          creatorsIds: r.creatorsIds ? r.creatorsIds : null,
          initializatorsIds: r.initializatorsIds ? r.initializatorsIds : null,
          operation: r.operation ? r.operation : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  /** syncing data with backend*/

  private async recoverUserConversations(
    type: ActiveUserConversationType
  ): Promise<Maybe<Array<Conversation>>> {
    try {
      let AUCfirstSet = await this.listAllActiveUserConversationIds({
        type,
      })

      if (AUCfirstSet instanceof QIError)
        throw new Error(JSON.stringify(AUCfirstSet))

      let { nextToken, items } = AUCfirstSet
      let activeIds = [...items]

      while (nextToken) {
        const set = await this.listAllActiveUserConversationIds({
          type,
          nextToken,
        })

        if (set instanceof QIError) break

        const { nextToken: token, items } = set

        activeIds = [...activeIds, ...items]

        if (token) nextToken = token
        else break
      }

      let conversationfirstSet = await this.listConversationsByIds(activeIds)

      if (conversationfirstSet instanceof QIError)
        throw new Error(JSON.stringify(conversationfirstSet))

      let { unprocessedKeys, items: conversations } = conversationfirstSet
      let conversationsItems = [...conversations]

      while (unprocessedKeys) {
        const set = await this.listConversationsByIds(unprocessedKeys)

        if (set instanceof QIError) break

        const { unprocessedKeys: ids, items } = set

        conversationsItems = [...conversationsItems, ...items]

        if (ids) unprocessedKeys = ids
        else break
      }

      const currentUser = await this.getCurrentUser()

      if (currentUser instanceof QIError)
        throw new Error(JSON.stringify(currentUser))

      //stores/update the conversations into the local db
      if (this._storage.typeOf() === "DexieStorage") {
        await this._storage.insertBulkSafe<WebConversation>(
          "conversation",
          conversationsItems.map((conversation: Conversation) => {
            let isConversationArchived = false

            if (currentUser.archivedConversations) {
              const index = currentUser.archivedConversations.findIndex(
                (id) => {
                  return id === conversation.id
                }
              )

              if (index > -1) isConversationArchived = true
            }

            return Converter.fromConversationToWebConversation(
              conversation,
              this._account!.did,
              this._account!.organizationId,
              isConversationArchived
            )
          })
        )
      } else if (this._storage.typeOf() === "RealmStorage") {
        //mobile insert TODO
      }

      return conversationsItems
      //TODO, still thinking how to integrate the local db objects with Chat, Conversation object that comes from GraphQL
    } catch (error) {
      console.log("[ERROR]: recoverUserConversations() -> ", error)
    }

    return null
  }

  private async recoverKeysFromConversations(): Promise<boolean> {
    try {
      let firstConversationMemberSet =
        await this.listConversationMemberByUserId()

      if (firstConversationMemberSet instanceof QIError)
        throw new Error(JSON.stringify(firstConversationMemberSet))

      let { nextToken, items } = firstConversationMemberSet
      let conversationMemberItems = [...items]

      while (nextToken) {
        const set = await this.listConversationMemberByUserId(nextToken)

        if (set instanceof QIError) break

        const { nextToken: token, items } = set

        conversationMemberItems = [...conversationMemberItems, ...items]

        if (token) nextToken = token
        else break
      }

      //let's take all the information related to our keys into _userKeyPair object. These are the public and private key of the current user.
      //To do that, let's do a query on the local user table. If the _userKeyPair is already set, we skip this operation.
      if (!this._userKeyPair) {
        if (this._storage.typeOf() === "DexieStorage") {
          const user = (await this._storage.get(
            "user",
            "did",
            this._account!.did
          )) as WebUser

          const { e2eEncryptedPrivateKey, e2ePublicKey: e2ePublicKeyPem } = user
          const { e2eSecret } = this._account!
          const { e2eSecretIV } = this._account!

          const e2ePrivateKeyPem = Crypto.decryptAES_CBC(
            e2eEncryptedPrivateKey,
            Buffer.from(e2eSecret).toString("base64"),
            Buffer.from(e2eSecretIV).toString("base64")
          )

          const userKeyPair = await Crypto.generateKeyPairFromPem(
            e2ePublicKeyPem,
            e2ePrivateKeyPem
          )

          if (!userKeyPair)
            throw new Error("Impossible to recover the user key pair.")

          this.setUserKeyPair(userKeyPair)
        } else if (this._storage.typeOf() === "RealmStorage") {
        }
      }

      //now, from the private key of the user, we will decrypt all the information about the conversation member.
      //we will store these decrypted pairs public keys/private keys into the _keyPairsMap array.
      const _keyPairsMap: Array<KeyPairItem> = []
      let isError: boolean = false

      for (const conversationMember of conversationMemberItems) {
        const {
          encryptedConversationPrivateKey,
          encryptedConversationPublicKey,
        } = conversationMember
        const privateKeyPem = Crypto.decryptStringOrFail(
          this.getUserKeyPair()!.privateKey,
          encryptedConversationPrivateKey
        )
        const publicKeyPem = Crypto.decryptStringOrFail(
          this.getUserKeyPair()!.privateKey,
          encryptedConversationPublicKey
        )
        const keypair = await Crypto.generateKeyPairFromPem(
          privateKeyPem,
          publicKeyPem
        )

        if (!keypair) {
          isError = true
          break
        }

        _keyPairsMap.push({
          id: conversationMember.conversationId,
          keypair,
        })
      }

      if (isError)
        throw new Error("Failed to convert a public/private key pair.")

      this.setKeyPairMap(_keyPairsMap)

      return true
    } catch (error) {
      console.log("[ERROR]: recoverKeysFromConversations() -> ", error)
    }

    return false
  }

  private async recoverMessagesFromConversations(
    conversations: Array<Conversation>
  ): Promise<boolean> {
    try {
      for (const conversation of conversations) {
        const { id, lastMessageSentAt } = conversation

        //if the conversation hasn't any message it's useless to download the messages.
        if (!lastMessageSentAt) continue

        //let's see if the last message sent into the conversation is more recent than the last message stored in the database
        if (this._storage.typeOf() === "DexieStorage") {
          //messages important handling
          const messagesImportantFirstSet =
            await this.listMessagesImportantByUserConversationId({
              conversationId: id,
            })

          if (messagesImportantFirstSet instanceof QIError)
            throw new Error(JSON.stringify(messagesImportantFirstSet))

          let { nextToken, items } = messagesImportantFirstSet
          let messagesImportant = [...items]

          while (nextToken) {
            const set = await this.listMessagesImportantByUserConversationId({
              conversationId: id,
              nextToken,
            })

            if (set instanceof QIError) break

            const { nextToken: token, items } = set

            messagesImportant = [...messagesImportant, ...items]

            if (token) nextToken = token
            else break
          }

          //messages handling
          const userTable = this._storage.getTable("user") as Dexie.Table<
            WebUser,
            string,
            WebUser
          >
          const lastMessageStored = await userTable
            .orderBy("createdAt")
            .reverse()
            .first()

          const canDownloadMessages =
            !lastMessageStored ||
            (lastMessageStored &&
              lastMessageStored.createdAt < lastMessageSentAt)

          if (canDownloadMessages) {
            const messagesFirstSet = await this.listMessagesByConversationId({
              id,
            })

            if (messagesFirstSet instanceof QIError)
              throw new Error(JSON.stringify(messagesFirstSet))

            let { nextToken, items } = messagesFirstSet
            let messages = [...items]

            while (nextToken) {
              const set = await this.listMessagesByConversationId({
                id,
                nextToken,
              })

              if (set instanceof QIError) break

              const { nextToken: token, items } = set

              messages = [...messages, ...items]

              if (token) nextToken = token
              else break
            }

            //let's store the messages without create duplicates
            this._storage.insertBulkSafe(
              "message",
              messages.map((message) => {
                const isMessageImportant =
                  messagesImportant.findIndex((important) => {
                    return important.messageId === message.id
                  }) > -1

                return Converter.fromMessageToWebMessage(
                  message,
                  this._account!.did,
                  this._account!.organizationId,
                  isMessageImportant
                )
              })
            )
          }
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }

      return true
    } catch (error) {
      console.log("[ERROR]: recoverMessagesFromConversations() -> ", error)
    }

    return false
  }

  private async _sync(syncingCounter: number): Promise<void> {
    this._isSyncing = true
    this._emit("syncing", this._syncingCounter)

    //first operation. Recover the list of the conversations in which the user is a member.
    //unactive conversations are the convos in which the user left the group or has been ejected
    const activeConversations = await this.recoverUserConversations(
      ActiveUserConversationType.Active
    )
    const unactiveConversations = await this.recoverUserConversations(
      ActiveUserConversationType.Canceled
    )

    if (!activeConversations || !unactiveConversations) {
      this._emit("syncError", { error: `error during conversation sincying.` })
      return
    }

    //second operation. Recover the list of conversation member objects, in order to retrieve the public & private keys of all conversations.
    const keysRecovered = await this.recoverKeysFromConversations()
    if (!keysRecovered) {
      this._emit("syncError", {
        error: `error during recovering of the keys from conversations.`,
      })
      return
    }

    //third operation. For each conversation, we need to download the messages if the lastMessageSentAt of the conversation is != null
    //and the date of the last message stored in the local db is less recent than the lastMessageSentAt date.
    const messagesRecovered = await this.recoverMessagesFromConversations([
      ...activeConversations,
      ...unactiveConversations,
    ])
    if (!messagesRecovered) {
      this._emit("syncError", {
        error: `error during recovering of the messages from conversations.`,
      })
      return
    }

    //let's setup an array of the conversations in the first sync cycle.
    //This will allow to map the conversations in every single cycle that comes after the first one.
    if (syncingCounter === 0) {
      for (const activeConversation of activeConversations)
        this._conversationsMap.push({
          type: "ACTIVE",
          conversationId: activeConversation.id,
          conversation: activeConversation,
        })

      for (const unactiveConversation of unactiveConversations)
        this._conversationsMap.push({
          type: "CANCELED",
          conversationId: unactiveConversation.id,
          conversation: unactiveConversation,
        })
    } else {
      //this situation happens when a subscription between onAddMemberToConversation, onEjectMember, onLeaveConversation doesn't fire properly.
      //here we can check if there are differences between the previous sync and the current one
      //theoretically since we have subscriptions, we should be in a situation in which we don't have any difference
      //since the subscription role is to keep the array _conversationsMap synchronized.
      //But it can be also the opposite. So inside this block we will check if there are conversations that need
      //subscriptions to be added or the opposite (so subscriptions that need to be removed)

      const conversations = [...activeConversations, ...unactiveConversations]
      const flatConversationMap = this._conversationsMap.map(
        (item) => item.conversation
      )

      const { added, removed } = findAddedAndRemovedConversation(
        conversations,
        flatConversationMap
      )

      if (added.length > 0)
        for (const conversation of added)
          this._addSubscriptionsSync(conversation.id)

      if (removed.length > 0)
        for (const conversation of removed)
          this._removeSubscribtionsSync(conversation.id)
    }

    if (syncingCounter === 0) this._emit("sync")
    else this._emit("syncUpdate", this._syncingCounter)

    this._syncingCounter++

    setTimeout(async () => {
      await this._sync(this._syncingCounter)
    }, Chat.SYNCING_TIME)
  }

  private async _onAddMemberToConversationSync(
    response:
      | QIError
      | {
          conversationId: string
          memberId: string
          item: ConversationMember
        },
    source: OperationResult<
      {
        onAddMemberToConversation: AddMemberToConversationResultGraphQL
      },
      SubscriptionOnAddMemberToConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        //we need to update the _keyPairsMap with the new keys of the new conversation
        const { conversationId } = response
        const {
          encryptedConversationPrivateKey,
          encryptedConversationPublicKey,
        } = response.item
        //these pair is encrypted with the public key of the current user, so we need to decrypt them
        const conversationPrivateKeyPem = Crypto.decryptStringOrFail(
          this._userKeyPair!.privateKey,
          encryptedConversationPrivateKey
        )
        const conversationPublicKeyPem = Crypto.decryptStringOrFail(
          this._userKeyPair!.privateKey,
          encryptedConversationPublicKey
        )
        const keypair = await Crypto.generateKeyPairFromPem(
          conversationPublicKeyPem,
          conversationPrivateKeyPem
        )

        //this add a key pair only if it doesn't exist. if it does, then internally skip this operation
        this.addKeyPairItem({
          id: conversationId,
          keypair: keypair!,
        })

        //we update also the _unsubscribeSyncSet array using the uuid emitted by the subscription
        //in order to map the unsubscribe function with the conversation
        const index = this._unsubscribeSyncSet.findIndex((item) => {
          return item.uuid === uuid
        })

        if (index > -1)
          this._unsubscribeSyncSet[index].conversationId = conversationId

        //now we store the conversation in the local database
        const responseConversation = await this.listConversationsByIds([
          conversationId,
        ])

        if (!(responseConversation instanceof QIError)) {
          const { items } = responseConversation
          const conversation = items[0]

          //we need to check if the conversation was already inside the _conversationsMap array. If it exists then we update the array
          //otherwise we add a new element
          const index = this._conversationsMap.findIndex((conversationItem) => {
            return conversationItem.conversationId === conversation.id
          })

          //this is an additional check that it's used to avoid to add the subscriptions to a conversation that potentially
          //could have them already. This could happen potentially if the _sync() is executed
          //immediately before the _onAddMemberToConversationSync() in the javascript event loop
          const subscriptionConversationCheck = {
            conversationWasActive: false,
          }

          if (index > -1) {
            //it should never be ACTIVE at this point, but this is for more safety
            if (this._conversationsMap[index].type === "ACTIVE")
              subscriptionConversationCheck.conversationWasActive = true

            this._conversationsMap[index].type = "ACTIVE"
            this._conversationsMap[index].conversation = conversation
          } else
            this._conversationsMap.push({
              conversation,
              conversationId: conversation.id,
              type: "ACTIVE",
            })

          const currentUser = await this.getCurrentUser()

          if (currentUser instanceof QIError)
            throw new Error(JSON.stringify(currentUser))

          //stores/update the conversations into the local db
          if (this._storage.typeOf() === "DexieStorage") {
            let isConversationArchived = false

            if (currentUser.archivedConversations) {
              const index = currentUser.archivedConversations.findIndex(
                (id) => {
                  return id === conversationId
                }
              )

              if (index > -1) isConversationArchived = true
            }

            this._storage.insertBulkSafe<WebConversation>("conversation", [
              Converter.fromConversationToWebConversation(
                conversation,
                this._account!.did,
                this._account!.organizationId,
                isConversationArchived
              ),
            ])
          } else if (this._storage.typeOf() === "RealmStorage") {
            //mobile insert TODO
          }

          //let's remove all the subscriptions previously added
          if (subscriptionConversationCheck.conversationWasActive) {
            this._removeSubscribtionsSync(conversationId)
            this._conversationsMap[index].type = "ACTIVE" //assign again "type" the value "ACTIVE" because _removeSubscribtionsSync() turns type to "CANCELED"
          }

          //let's add the subscriptions in order to keep synchronized this conversation
          this._addSubscriptionsSync(conversationId)
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onAddMemberToConversationSync() -> ", error)
    }
  }

  private async _onAddReactionSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onAddReaction: MessageGraphQL
      },
      SubscriptionOnAddReactionArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          this._storage.insertBulkSafe("message", [
            Converter.fromMessageToWebMessage(
              response,
              this._account!.did,
              this._account!.organizationId,
              false
            ),
          ])
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onAddReactionSync() -> ", error)
    }
  }

  private async _onRemoveReactionSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onRemoveReaction: MessageGraphQL
      },
      SubscriptionOnRemoveReactionArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          this._storage.insertBulkSafe("message", [
            Converter.fromMessageToWebMessage(
              response,
              this._account!.did,
              this._account!.organizationId,
              false
            ),
          ])
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onRemoveReactionSync() -> ", error)
    }
  }

  private async _onSendMessageSync(
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
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          this._storage.insertBulkSafe("message", [
            Converter.fromMessageToWebMessage(
              response,
              this._account!.did,
              this._account!.organizationId,
              false
            ),
          ])
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onSendMessageSync() -> ", error)
    }
  }

  private async _onEditMessageSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onEditMessage: MessageGraphQL
      },
      SubscriptionOnEditMessageArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          this._storage.insertBulkSafe("message", [
            Converter.fromMessageToWebMessage(
              response,
              this._account!.did,
              this._account!.organizationId,
              false
            ),
          ])
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onEditMessageSync() -> ", error)
    }
  }

  private async _onDeleteMessageSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onDeleteMessage: MessageGraphQL
      },
      SubscriptionOnDeleteMessageArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          await this._storage.deleteItem("message", response.id)
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onDeleteMessageSync() -> ", error)
    }
  }

  private async _onBatchDeleteMessagesSync(
    response:
      | QIError
      | {
          conversationId: string
          messagesIds: string[]
        },
    source: OperationResult<
      {
        onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL
      },
      SubscriptionOnBatchDeleteMessagesArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          await this._storage.deleteBulk("message", response.messagesIds)
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onBatchDeleteMessagesSync() -> ", error)
    }
  }

  private async _onUpdateConversationGroupSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onUpdateConversationGroup: ConversationGraphQL
      },
      SubscriptionOnUpdateConversationGroupArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          const conversationStored = (await this._storage.get(
            "conversation",
            "id",
            response.id
          )) as Maybe<WebConversation>

          this._storage.insertBulkSafe("conversation", [
            Converter.fromConversationToWebConversation(
              response,
              this._account!.did,
              this._account!.organizationId,
              conversationStored ? conversationStored.isArchived : false
            ),
          ])
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onUpdateConversationGroupSync() -> ", error)
    }
  }

  private _onEjectMemberSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onEjectMember: ConversationGraphQL
      },
      SubscriptionOnEjectMemberArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO handling system messages that shows the user was ejected
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          const conversationId = response.id
          this._removeSubscribtionsSync(conversationId)
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onEjectMemberSync() -> ", error)
    }
  }

  private _onLeaveConversationSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onLeaveConversation: ConversationGraphQL
      },
      SubscriptionOnLeaveConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO handling system messages that shows the user left the conversation
    try {
      if (!(response instanceof QIError)) {
        if (this._storage.typeOf() === "DexieStorage") {
          const conversationId = response.id
          this._removeSubscribtionsSync(conversationId)
        } else if (this._storage.typeOf() === "RealmStorage") {
          //TODO
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onLeaveConversationSync() -> ", error)
    }
  }

  private _onMuteConversationSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onMuteConversation: ConversationGraphQL
      },
      SubscriptionOnMuteConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO socket notification handling
    try {
      if (!(response instanceof QIError)) {
      }
    } catch (error) {
      console.log("[ERROR]: _onMuteConversationSync() -> ", error)
    }
  }

  private _onUnmuteConversationSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onUnmuteConversation: ConversationGraphQL
      },
      SubscriptionOnUnmuteConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO socket notification handling
    try {
      if (!(response instanceof QIError)) {
      }
    } catch (error) {
      console.log("[ERROR]: _onUnmuteConversationSync() -> ", error)
    }
  }

  private _addSubscriptionsSync(conversationId: string) {
    //add reaction(conversationId)
    const onAddReaction = this.onAddReaction(
      conversationId,
      this._onAddReactionSync
    )

    if (!(onAddReaction instanceof QIError)) {
      const { unsubscribe, uuid } = onAddReaction
      this._unsubscribeSyncSet.push({
        type: "onAddReaction",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //remove reaction(conversationId)
    const onRemoveReaction = this.onRemoveReaction(
      conversationId,
      this._onRemoveReactionSync
    )

    if (!(onRemoveReaction instanceof QIError)) {
      const { unsubscribe, uuid } = onRemoveReaction
      this._unsubscribeSyncSet.push({
        type: "onRemoveReaction",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //send message(conversationId)
    const onSendMessage = this.onSendMessage(
      conversationId,
      this._onSendMessageSync
    )

    if (!(onSendMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onSendMessage
      this._unsubscribeSyncSet.push({
        type: "onSendMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //edit message(conversationId)
    const onEditMessage = this.onEditMessage(
      conversationId,
      this._onEditMessageSync
    )

    if (!(onEditMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onEditMessage
      this._unsubscribeSyncSet.push({
        type: "onEditMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //delete message(conversationId)
    const onDeleteMessage = this.onDeleteMessage(
      conversationId,
      this._onDeleteMessageSync
    )

    if (!(onDeleteMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onDeleteMessage
      this._unsubscribeSyncSet.push({
        type: "onDeleteMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //delete batch messages(conversationId)
    const onBatchDeleteMessages = this.onBatchDeleteMessages(
      conversationId,
      this._onBatchDeleteMessagesSync
    )

    if (!(onBatchDeleteMessages instanceof QIError)) {
      const { unsubscribe, uuid } = onBatchDeleteMessages
      this._unsubscribeSyncSet.push({
        type: "onBatchDeleteMessages",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //update settings group(conversationId)
    const onUpdateConversationGroup = this.onUpdateConversationGroup(
      conversationId,
      this._onUpdateConversationGroupSync
    )

    if (!(onUpdateConversationGroup instanceof QIError)) {
      const { unsubscribe, uuid } = onUpdateConversationGroup
      this._unsubscribeSyncSet.push({
        type: "onUpdateConversationGroup",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //eject member(conversationId)
    const onEjectMember = this.onEjectMember(
      conversationId,
      this._onEjectMemberSync
    )

    if (!(onEjectMember instanceof QIError)) {
      const { unsubscribe, uuid } = onEjectMember
      this._unsubscribeSyncSet.push({
        type: "onEjectMember",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //leave group/conversation(conversationId)
    const onLeaveConversation = this.onLeaveConversation(
      conversationId,
      this._onLeaveConversationSync
    )

    if (!(onLeaveConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onLeaveConversation
      this._unsubscribeSyncSet.push({
        type: "onLeaveConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //mute conversation(conversationId)
    const onMuteConversation = this.onMuteConversation(
      conversationId,
      this._onMuteConversationSync
    )

    if (!(onMuteConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onMuteConversation
      this._unsubscribeSyncSet.push({
        type: "onMuteConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //unmute conversation(conversationId)
    const onUnmuteConversation = this.onUnmuteConversation(
      conversationId,
      this._onUnmuteConversationSync
    )

    if (!(onUnmuteConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onUnmuteConversation
      this._unsubscribeSyncSet.push({
        type: "onUnmuteConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    }
  }

  private _removeSubscribtionsSync(conversationId: string) {
    //let's remove first the subscriptions
    const unsubscribeItems = this._unsubscribeSyncSet.filter((item) => {
      return item.conversationId === conversationId
    })

    unsubscribeItems.forEach((item) => {
      try {
        item.unsubscribe()
      } catch (error) {
        console.log("[ERROR]: unsubscribe() -> ", item.uuid, item.type)
      }
    })

    //let's remove the unsubscriptions functions from the _unsubscribeSyncSet since we have unsubscribed everything
    this._unsubscribeSyncSet = this._unsubscribeSyncSet.filter((item) => {
      return item.conversationId !== conversationId
    })

    //let's update also the _conversationsMap and turn this conversation as unactive
    const index = this._conversationsMap.findIndex((conversation) => {
      return conversation.conversationId === conversationId
    })

    if (index > -1) this._conversationsMap[index].type = "CANCELED"
  }

  async sync(callback: Function) {
    if (!this._account)
      throw new Error("You must be authenticated before to sync.")
    if (!this._storage.isStorageEnabled())
      throw new Error("sync() is available only if you enable the storage.")
    if (this._syncingCounter > 0)
      throw new Error("You have already launched sync().")

    this._on("sync", () => {
      this._isSyncing = false
      callback()
    })

    await this._sync(this._syncingCounter)

    //add member to conversation. This event is global, basically the user is always listening if
    //someone wants to add him into a conversation.
    const onAddMemberToConversation = this.onAddMemberToConversation(
      this._account!.dynamoDBUserID,
      this._onAddMemberToConversationSync
    )

    if (!(onAddMemberToConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onAddMemberToConversation
      this._unsubscribeSyncSet.push({
        type: "onAddMemberToConversation",
        unsubscribe,
        uuid,
        conversationId: "", //this value is updated inside the callback fired by the subscription
      })
    }

    //now that we have a _conversationsMap array filled, we can add subscription for every conversation that is currently active
    for (const { conversationId } of this._conversationsMap.filter(
      (conversation) => conversation.type === "ACTIVE"
    )) {
      this._addSubscriptionsSync(conversationId)
    }
  }

  syncing(callback: (isSyncing: boolean, syncingCounter: number) => void) {
    this._on("syncing", (syncingCounter: number) => {
      callback(this._isSyncing, syncingCounter)
    })
  }

  syncUpdate(callback: (syncingCounter: number) => void) {
    this._on("syncUpdate", (syncingCounter: number) => {
      callback(syncingCounter)
    })
  }
}
