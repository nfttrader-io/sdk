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
  MutationRemoveReactionFromMessageArgs,
  MutationRequestTradeArgs,
  MutationSendMessageArgs,
  MutationUnarchiveConversationArgs,
  MutationUnarchiveConversationsArgs,
  UnarchiveConversationsBatchResult as UnarchiveConversationsBatchResultGraphQL,
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
  SubscriptionOnAddImportantMessageArgs,
  SubscriptionOnRemoveImportantMessageArgs,
  SubscriptionOnUpdateConversationGroupArgs,
  SubscriptionOnEjectMemberArgs,
  SubscriptionOnLeaveConversationArgs,
  SubscriptionOnAddPinConversationArgs,
  SubscriptionOnRemovePinConversationArgs,
  SubscriptionOnArchiveConversationArgs,
  SubscriptionOnUnarchiveConversationArgs,
  SubscriptionOnMuteConversationArgs,
  SubscriptionOnUpdateUserArgs,
  SubscriptionOnRequestTradeArgs,
  SubscriptionOnDeleteRequestTradeArgs,
  SubscriptionOnAddMembersToConversationArgs,
  QueryListMessagesImportantByUserConversationIdArgs,
  ListMessagesImportantByUserConversationIdResult as ListMessagesImportantByUserConversationIdResultGraphQL,
  QueryListConversationsPinnedByCurrentUserArgs,
  ListConversationsPinnedByUserIdResult as ListConversationsPinnedByUserIdResultGraphQL,
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
} from "./constants/chat/queries"
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
} from "./interfaces/chat/schema/args"
import { UAMutationEngine, UAQueryEngine } from "./interfaces/chat/core/ua"
import { EjectMemberArgs } from "./interfaces/chat/schema/args/ejectmember"
import { Maybe } from "./types/base"
import {
  onDeleteMessage,
  onEditMessage,
  onSendMessage,
  onRemoveReaction,
  onAddReaction,
  onAddPinMessage,
  onRemovePinMessage,
  onAddImportantMessage,
  onRemoveImportantMessage,
  onUpdateConversationGroup,
  onEjectMember,
  onLeaveConversation,
  onAddPinConversation,
  onRemovePinConversation,
  onArchiveConversation,
  onUnarchiveConversation,
  onMuteConversation,
  onUnmuteConversation,
  onUpdateUser,
  onRequestTrade,
  onDeleteRequestTrade,
  onAddMembersToConversation,
} from "./constants/chat/subscriptions"
import { OperationResult } from "@urql/core"
import { SubscriptionGarbage } from "./types/chat/subscriptiongarbage"
import { KeyPairItem } from "./types/chat/keypairitem"

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

    const listConversationMembers: {
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

    return listConversationMembers
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId ? response.conversationId : null,
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId ? response.conversationId : null,
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
  ): Promise<
    { keypairItem: KeyPairItem; conversation: Conversation } | QIError
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
          name: Crypto.encrypt(keypair.publicKey, args.name),
          description: Crypto.encrypt(keypair.publicKey, args.description),
          bannerImageURL: Crypto.encrypt(
            keypair.publicKey,
            args.bannerImageURL
          ),
          imageURL: Crypto.encrypt(keypair.publicKey, args.imageURL),
        },
      }
    )

    if (response instanceof QIError) return response

    this.addKeyPairItem({
      id: response.id,
      keypair,
    })

    const conversationGroup: {
      keypairItem: KeyPairItem
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        keypair,
      },
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.id,
        name: Crypto.decrypt(keypair.privateKey, response.name),
        description: response.description
          ? Crypto.decrypt(keypair.privateKey, response.description)
          : null,
        imageURL: response.imageURL
          ? new URL(Crypto.decrypt(keypair.privateKey, response.imageURL))
          : null,
        bannerImageURL: response.bannerImageURL
          ? new URL(Crypto.decrypt(keypair.privateKey, response.bannerImageURL))
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
      }),
    }

    return conversationGroup
  }

  async createConversationOneToOne(
    args: CreateConversationOneToOneArgs
  ): Promise<
    QIError | { keypairItem: KeyPairItem; conversation: Conversation }
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
          name: Crypto.encrypt(keypair.publicKey, args.name),
          description: Crypto.encrypt(keypair.publicKey, args.description),
          bannerImageURL: Crypto.encrypt(
            keypair.publicKey,
            args.bannerImageURL
          ),
          imageURL: Crypto.encrypt(keypair.publicKey, args.imageURL),
        },
      }
    )

    if (response instanceof QIError) return response

    const conversationItem: {
      keypairItem: KeyPairItem
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        keypair: keypair,
      },
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.id,
        name: Crypto.encrypt(keypair.publicKey, response.name),
        description: response.description
          ? Crypto.encrypt(keypair.publicKey, response.description)
          : null,
        imageURL: response.imageURL
          ? new URL(Crypto.encrypt(keypair.publicKey, response.imageURL))
          : null,
        bannerImageURL: response.bannerImageURL
          ? new URL(Crypto.encrypt(keypair.publicKey, response.bannerImageURL))
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
      }),
    }

    return conversationItem
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId ? response.conversationId : null,
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
      operation: response.operation
        ? JSON.parse(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.conversationId!),
              response.operation
            )
          )
        : null,
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId ? response.conversationId : null,
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId,
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId,
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
      operation: response.operation
        ? JSON.parse(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.conversationId!),
              response.operation
            )
          )
        : null,
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId,
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

  async unarchiveConversation(): Promise<QIError | Conversation>
  async unarchiveConversation(id: string): Promise<QIError | Conversation>
  async unarchiveConversation(id?: unknown): Promise<QIError | Conversation> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unarchiveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationUnarchiveConversationArgs,
      { unarchiveConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "unarchiveConversation",
      unarchiveConversation,
      "_mutation() -> unarchiveConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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

  async unarchiveConversations(
    ids: Array<string>
  ): Promise<
    { concatConversationIds: string; items: Array<{ id: string }> } | QIError
  > {
    const response = await this._mutation<
      MutationUnarchiveConversationsArgs,
      { unarchiveConversations: UnarchiveConversationsBatchResultGraphQL },
      UnarchiveConversationsBatchResultGraphQL
    >(
      "unarchiveConversations",
      unarchiveConversations,
      "_mutation() -> unarchiveConversations()",
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId ? response.conversationId : null,
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
      content: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.conversationId),
        response.content
      ),
      conversationId: response.conversationId ? response.conversationId : null,
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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

  /*
    Query
  */

  async listAllActiveUserConversationIds(
    args: ListAllActiveUserConversationIdsArgs
  ): Promise<QIError | { items: string[]; nextToken?: String | undefined }> {
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

  async listConversationsByIds(ids: string[]): Promise<
    | QIError
    | {
        items: Conversation[]
        unprocessedKeys?: Maybe<Maybe<string>[]> | undefined
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
      unprocessedKeys?: Maybe<Maybe<string>[]>
      items: Array<Conversation>
    } = {
      unprocessedKeys: response.unprocessedKeys,
      items: response.items.map((item) => {
        return new Conversation({
          ...this._parentConfig!,
          id: item.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(item.id),
            item.name
          ),
          description: item.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(item.id),
                item.description
              )
            : null,
          imageURL: item.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(item.id),
                  item.imageURL
                )
              )
            : null,
          bannerImageURL: item.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(item.id),
                  item.bannerImageURL
                )
              )
            : null,
          settings: item.settings ? JSON.parse(item.settings) : null,
          membersIds: item.membersIds ? item.membersIds : null,
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
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(item.conversationId),
            item.content
          ),
          conversationId: item.conversationId,
          userId: item.userId ? item.userId : null,
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
            content: Crypto.decryptStringOrFail(
              this.findPrivateKeyById(item.message!.conversationId),
              item.message!.content
            ),
            conversationId: item.message!.conversation
              ? item.message!.conversationId
              : null,
            userId: item.message!.userId ? item.message!.userId : null,
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
            name: Crypto.decryptStringOrFail(
              this.findPrivateKeyById(item.conversation!.id),
              item.conversation!.name
            ),
            description: item.conversation!.description
              ? Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(item.conversation!.id),
                  item.conversation!.description
                )
              : null,
            imageURL: item.conversation!.imageURL
              ? new URL(
                  Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(item.conversation!.id),
                    item.conversation!.imageURL
                  )
                )
              : null,
            bannerImageURL: item.conversation!.bannerImageURL
              ? new URL(
                  Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(item.conversation!.id),
                    item.conversation!.bannerImageURL
                  )
                )
              : null,
            settings: item.conversation!.settings
              ? JSON.parse(item.conversation!.settings)
              : null,
            membersIds: item.conversation!.membersIds
              ? item.conversation!.membersIds
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
          encryptedPrivateKey: item.encryptedPrivateKey
            ? item.encryptedPrivateKey
            : null,
          publicKey: item.publicKey ? item.publicKey : null,
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
      name: Crypto.decryptStringOrFail(
        this.findPrivateKeyById(response.id),
        response.name
      ),
      description: response.description
        ? Crypto.decryptStringOrFail(
            this.findPrivateKeyById(response.id),
            response.description
          )
        : null,
      imageURL: response.imageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.imageURL
            )
          )
        : null,
      bannerImageURL: response.bannerImageURL
        ? new URL(
            Crypto.decryptStringOrFail(
              this.findPrivateKeyById(response.id),
              response.bannerImageURL
            )
          )
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversationId,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
      )
    })

    return { unsubscribe, uuid }
  }

  onAddImportantMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onAddImportantMessage: MessageGraphQL },
        SubscriptionOnAddImportantMessageArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddImportantMessage"
    const metasubcription = this._subscription<
      SubscriptionOnAddImportantMessageArgs,
      { onAddImportantMessage: MessageGraphQL }
    >(onAddImportantMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddImportantMessage: MessageGraphQL },
        MessageGraphQL
      >("onAddImportantMessage", result)

      if (r instanceof QIError) {
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
      )
    })

    return { unsubscribe, uuid }
  }

  onRemoveImportantMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onRemoveImportantMessage: MessageGraphQL },
        SubscriptionOnRemoveImportantMessageArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemoveImportantMessage"
    const metasubcription = this._subscription<
      SubscriptionOnRemoveImportantMessageArgs,
      { onRemoveImportantMessage: MessageGraphQL }
    >(onRemoveImportantMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemoveImportantMessage: MessageGraphQL },
        MessageGraphQL
      >("onRemoveImportantMessage", result)

      if (r instanceof QIError) {
        callback(r, result)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.conversationId),
            r.content
          ),
          conversationId: r.conversation ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
            : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
      )
    })

    return { unsubscribe, uuid }
  }

  onArchiveConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onArchiveConversation: ConversationGraphQL },
        SubscriptionOnArchiveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onArchiveConversation"
    const metasubcription = this._subscription<
      SubscriptionOnArchiveConversationArgs,
      { onArchiveConversation: ConversationGraphQL }
    >(onArchiveConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onArchiveConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onArchiveConversation", result)

      if (r instanceof QIError) {
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
      )
    })

    return { unsubscribe, uuid }
  }

  onUnarchiveConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnarchiveConversation: ConversationGraphQL },
        SubscriptionOnUnarchiveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUnarchiveConversation"
    const metasubcription = this._subscription<
      SubscriptionOnUnarchiveConversationArgs,
      { onUnarchiveConversation: ConversationGraphQL }
    >(onUnarchiveConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUnarchiveConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onUnarchiveConversation", result)

      if (r instanceof QIError) {
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
        SubscriptionOnUnarchiveConversationArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUnmuteConversation"
    const metasubcription = this._subscription<
      SubscriptionOnUnarchiveConversationArgs,
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
        callback(r, result)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: Crypto.decryptStringOrFail(
            this.findPrivateKeyById(r.id),
            r.name
          ),
          description: r.description
            ? Crypto.decryptStringOrFail(
                this.findPrivateKeyById(r.id),
                r.description
              )
            : null,
          imageURL: r.imageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.imageURL
                )
              )
            : null,
          bannerImageURL: r.bannerImageURL
            ? new URL(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.bannerImageURL
                )
              )
            : null,
          settings: r.settings ? JSON.parse(r.settings) : null,
          membersIds: r.membersIds ? r.membersIds : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          items: r.items.map((item) => {
            return new ConversationMember({
              ...this._parentConfig!,
              id: item.id,
              conversationId: item.conversationId ? item.conversationId : null,
              userId: item.userId,
              type: item.type,
              encryptedConversationPublicKey:
                item.encryptedConversationPublicKey,
              encryptedConversationPrivateKey:
                item.encryptedConversationPrivateKey,
              createdAt: item.createdAt ? item.createdAt : null,
              client: this._client!,
            })
          }),
        },
        result
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
      >
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
        callback(r, result)
        return
      }

      callback(
        new User({
          ...this._parentConfig!,
          id: r.id,
          username: r.username ? r.username : null,
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
          encryptedPrivateKey: r.encryptedPrivateKey
            ? r.encryptedPrivateKey
            : null,
          publicKey: r.publicKey ? r.publicKey : null,
          createdAt: new Date(r.createdAt),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
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
          operation: r.operation
            ? JSON.parse(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.operation
                )
              )
            : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
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
      >
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
        callback(r, result)
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
          operation: r.operation
            ? JSON.parse(
                Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(r.id),
                  r.operation
                )
              )
            : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
        }),
        result
      )
    })

    return { unsubscribe, uuid }
  }
}
