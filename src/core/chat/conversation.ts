import {
  addMembersToConversation,
  addPinToConversation,
  addReportToConversation,
  archiveConversation,
  deleteConversationMessage,
  ejectMember,
  leaveConversation,
  muteConversation,
  removePinFromConversation,
  sendMessage,
  unarchiveConversation,
  unmuteConversation,
  updateConversationGroup,
} from "../../constants/chat/mutations"
import {
  MutationAddMembersToConversationArgs,
  ListConversationMembers as ListConversationMembersGraphQL,
  Conversation as ConversationGraphQL,
  Message as MessageGraphQL,
  MutationAddReportToConversationArgs,
  ConversationReport as ConversationReportGraphQL,
  MutationArchiveConversationArgs,
  MutationDeleteConversationMessageArgs,
  MutationEjectMemberArgs,
  MutationMuteConversationArgs,
  MutationSendMessageArgs,
  MutationUpdateConversationGroupArgs,
  MutationLeaveConversationArgs,
  MutationUnarchiveConversationArgs,
  MutationUnmuteConversationArgs,
  MutationAddPinToConversationArgs,
  MutationRemovePinFromConversationArgs,
  User as UserGraphQL,
  MutationAddMemberToConversationArgs,
  AddMemberToConversationResult as AddMemberToConversationResultGraphQL,
  MemberOutResult as MemberOutResultGraphQL,
} from "../../graphql/generated/graphql"
import {
  ConversationMutationEngine,
  ConversationQueryEngine,
} from "../../interfaces/chat/core/conversation"
import { ConversationInitConfig } from "../../types/chat/core/conversation"
import { ConversationSchema } from "../../interfaces/chat/schema"
import {
  AddMembersToConversationArgs,
  AddMemberToConversationArgs,
  AddReportToConversationArgs,
  EjectMemberArgs,
  MuteConversationArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
} from "../../types/chat/schema/args"
import { Maybe } from "../../types/base"
import { ConversationMember } from "./conversationmember"
import { ConversationReport } from "./conversationreport"
import { Engine } from "./engine"
import { Message } from "./message"
import { QIError } from "./qierror"
import { User } from "./user"
import { Crypto } from "./crypto"
import {
  getMembersFromConversationById,
  getOwnerFromConversationById,
} from "../../constants/chat/queries"
import { EngineInitConfig } from "../../types"
import { Reaction } from "./reaction"

/**
 * Represents a conversation in a chat application.
 * @class Conversation
 * @extends Engine
 * @implements ConversationSchema, ConversationQueryEngine, ConversationMutationEngine
 */

export class Conversation
  extends Engine
  implements
    ConversationSchema,
    ConversationQueryEngine,
    ConversationMutationEngine
{
  /**
   * @property {string} id - The unique identifier of the chat entity.
   */
  readonly id: string
  /**
   * @property {string} name - The name of the chat entity.
   */
  readonly name: string
  /**
   * @property {Maybe<string>} description - The description of the chat entity, if available.
   */
  readonly description: Maybe<string>
  /**
   * @property {Maybe<string>} imageURL - The URL of the image associated with the chat entity, if available.
   */
  readonly imageURL: Maybe<string>
  /**
   * @property {Maybe<string>} bannerImageURL - The URL of the banner image associated with the chat entity, if available.
   */
  readonly bannerImageURL: Maybe<string>
  /**
   * @property {Maybe<string>} settings - The settings of the chat entity, if available.
   */
  readonly settings: Maybe<string>
  /**
   * @property {Maybe<Array<string>>} membersIds - An array of member IDs in the chat group.
   */
  readonly membersIds: Maybe<Array<string>>
  /**
   * @property {Maybe<Array<{userId: string, createdAt: Date}>>} mutedBy - An array of member IDs in the conversation.
   */
  readonly mutedBy: Maybe<Array<{ userId: string; createdAt: Date }>>
  /**
   * @property {"GROUP" | "ONE_TO_ONE" | "COMMUNITY"} type - The type of chat group.
   */
  readonly type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  /**
   * @property {Maybe<Date>} lastMessageSentAt - The date when the last message was sent in the chat group.
   */
  readonly lastMessageSentAt: Maybe<Date>
  /**
   * @property {Date} createdAt - The id of the creator of the group
   */
  readonly ownerId: Maybe<string>
  /**
   * @property {Date} createdAt - The date when the chat group was created.
   */
  readonly createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - The date when the chat group was last updated.
   */
  readonly updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt -The date when the chat group was last deleted.
   */
  readonly deletedAt: Maybe<Date>

  /**
   * Constructor for creating a Conversation object with the provided configuration.
   * @param {ConversationInitConfig & EngineInitConfig} config - The configuration object containing conversation and engine initialization settings.
   * @returns None
   */
  constructor(config: ConversationInitConfig & EngineInitConfig) {
    super({
      apiKey: config.apiKey,
      storage: config.storage,
    })

    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.imageURL = config.imageURL
    this.bannerImageURL = config.bannerImageURL
    this.settings = config.settings
    this.membersIds = config.membersIds
    this.mutedBy = config.mutedBy
    this.type = config.type
    this.lastMessageSentAt = config.lastMessageSentAt
    this.ownerId = config.ownerId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt

    this._client = config.client
  }

  /**
   * Ejects a member from the conversation based on the provided userId.
   * @param {Pick<EjectMemberArgs, "userId">} args - An object containing the userId of the member to eject.
   * @returns {Promise<{
        conversationId: string
        conversation: Conversation
        memberOut: User
      } | QIError>} - A Promise that resolves to an object that contains Conversation, the conversation id and the user that was ejected if successful, or a QIError object if there was an error.
   */
  async ejectMember(args: Pick<EjectMemberArgs, "userId">): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  > {
    const response = await this._mutation<
      MutationEjectMemberArgs,
      { ejectMember: MemberOutResultGraphQL },
      MemberOutResultGraphQL
    >("ejectMember", ejectMember, "_mutation() -> ejectMember()", {
      input: {
        conversationId: this.id,
        userId: args.userId,
      },
    })

    if (response instanceof QIError) return response

    return {
      conversationId: response.conversationId,
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.conversation.id,
        name: response.conversation.name,
        description: response.conversation.description
          ? response.conversation.description
          : null,
        imageURL: response.conversation.imageURL
          ? response.conversation.imageURL
          : null,
        bannerImageURL: response.conversation.bannerImageURL
          ? response.conversation.bannerImageURL
          : null,
        settings: response.conversation.settings
          ? response.conversation.settings
          : null,
        membersIds: response.conversation.membersIds
          ? response.conversation.membersIds
          : null,
        mutedBy: response.conversation.mutedBy
          ? response.conversation.mutedBy
          : null,
        type: response.conversation.type,
        lastMessageSentAt: response.conversation.lastMessageSentAt
          ? response.conversation.lastMessageSentAt
          : null,
        ownerId: response.conversation.ownerId
          ? response.conversation.ownerId
          : null,
        createdAt: response.conversation.createdAt,
        updatedAt: response.conversation.updatedAt
          ? response.conversation.updatedAt
          : null,
        deletedAt: response.conversation.deletedAt
          ? response.conversation.deletedAt
          : null,
        client: this._client!,
      }),
      memberOut: new User({
        ...this._parentConfig!,
        id: response.memberOut.id,
        username: response.memberOut.username
          ? response.memberOut.username
          : null,
        did: response.memberOut.did,
        address: response.memberOut.address,
        email: response.memberOut.email ? response.memberOut.email : null,
        bio: response.memberOut.bio ? response.memberOut.bio : null,
        avatarUrl: response.memberOut.avatarUrl
          ? new URL(response.memberOut.avatarUrl)
          : null,
        isVerified: response.memberOut.isVerified
          ? response.memberOut.isVerified
          : false,
        isNft: response.memberOut.isNft ? response.memberOut.isNft : false,
        blacklistIds: response.memberOut.blacklistIds
          ? response.memberOut.blacklistIds
          : null,
        allowNotification: response.memberOut.allowNotification
          ? response.memberOut.allowNotification
          : false,
        allowNotificationSound: response.memberOut.allowNotificationSound
          ? response.memberOut.allowNotificationSound
          : false,
        visibility: response.memberOut.visibility
          ? response.memberOut.visibility
          : false,
        archivedConversations: response.memberOut.archivedConversations
          ? response.memberOut.archivedConversations
          : null,
        onlineStatus: response.memberOut.onlineStatus
          ? response.memberOut.onlineStatus
          : null,
        allowReadReceipt: response.memberOut.allowReadReceipt
          ? response.memberOut.allowReadReceipt
          : false,
        allowReceiveMessageFrom: response.memberOut.allowReceiveMessageFrom
          ? response.memberOut.allowReceiveMessageFrom
          : null,
        allowAddToGroupsFrom: response.memberOut.allowAddToGroupsFrom
          ? response.memberOut.allowAddToGroupsFrom
          : null,
        allowGroupsSuggestion: response.memberOut.allowGroupsSuggestion
          ? response.memberOut.allowGroupsSuggestion
          : false,
        e2ePublicKey: response.memberOut.e2ePublicKey
          ? response.memberOut.e2ePublicKey
          : null,
        e2eSecret: response.memberOut.e2eSecret
          ? response.memberOut.e2eSecret
          : null,
        e2eSecretIV: response.memberOut.e2eSecretIV
          ? response.memberOut.e2eSecretIV
          : null,
        createdAt: new Date(response.memberOut.createdAt),
        updatedAt: response.memberOut.updatedAt
          ? new Date(response.memberOut.updatedAt)
          : null,
        client: this._client!,
      }),
    }
  }

  /**
   * Asynchronously adds members to a conversation.
   * @param {Pick<AddMembersToConversationArgs, "membersIds">} args - An object containing the member IDs to add to the conversation.
   * @returns {Promise<QIError | { conversationId: string; items: ConversationMember[] }>} A promise that resolves to either a QIError object if there was an error, or an object containing the conversation ID and an array of ConversationMember objects.
   */
  async addMembersToConversation(
    args: Pick<AddMembersToConversationArgs, "members">
  ): Promise<
    QIError | { conversationId: string; items: ConversationMember[] }
  > {
    const response = await this._query<
      MutationAddMembersToConversationArgs,
      { addMembersToConversation: ListConversationMembersGraphQL },
      ListConversationMembersGraphQL
    >(
      "addMembersToConversation",
      addMembersToConversation,
      "_mutation() -> addMembers()",
      {
        input: {
          conversationId: this.id,
          members: args.members,
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

    return listConversations
  }

  /**
   * Asynchronously adds members to a conversation.
   * @param {Pick<AddMemberToConversationArgs, "member">} args - An object containing the member IDs to add to the conversation.
   * @returns {Promise<QIError | { conversationId: string; items: ConversationMember[] }>} A promise that resolves to either a QIError object if there was an error, or an object containing the conversation ID and an array of ConversationMember objects.
   */

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

  /**
   * Adds a report to the conversation with the provided description.
   * @param {Pick<AddReportToConversationArgs, "description">} args - An object containing the description of the report.
   * @returns {Promise<QIError | ConversationReport>} A promise that resolves to either a QIError if there was an error, or a ConversationReport object.
   */
  async addReportToConversation(
    args: Pick<AddReportToConversationArgs, "description">
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
          conversationId: this.id,
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

  /**
   * Archives a conversation by calling the archiveConversation mutation.
   * If an id is provided, it throws an error.
   * If no id is provided, it archives the conversation associated with the current instance.
   * @returns {Promise<User | QIError>} A Promise that resolves to a Conversation object if successful,
   * or a QIError object if an error occurs.
   */
  async archiveConversation(): Promise<User | QIError>
  async archiveConversation(id: string): Promise<User | QIError>
  async archiveConversation(id?: unknown): Promise<User | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use archiveConversation() instead."
      )

    const response = await this._mutation<
      MutationArchiveConversationArgs,
      { archiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "archiveConversation",
      archiveConversation,
      "_mutation() -> archiveConversation()",
      {
        conversationId: this.id,
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

  /**
   * Deletes a message with the given ID from the conversation.
   * @param {string} id - The ID of the message to delete.
   * @returns {Promise<QIError | Message>} A promise that resolves to either a QIError if the deletion fails,
   * or a Message object representing the deleted message.
   */
  async deleteMessage(id: string): Promise<QIError | Message> {
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
      messageRootId: response.messageRootId ? response.messageRootId : null,
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
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  /**
   * Asynchronously leaves the current conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<{
        conversationId: string
        conversation: Conversation
        memberOut: User
      } | QIError>} A Promise that resolves to a Conversation object if successful, or a QIError object if an error occurs.
   */
  async leaveConversation(): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  >
  async leaveConversation(id: string): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  >
  async leaveConversation(id?: unknown): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  > {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use leaveConversation() instead."
      )

    const response = await this._mutation<
      MutationLeaveConversationArgs,
      { leaveConversation: MemberOutResultGraphQL },
      MemberOutResultGraphQL
    >(
      "leaveConversation",
      leaveConversation,
      "_mutation() -> leaveConversation()",
      {
        conversationId: this.id,
      }
    )

    if (response instanceof QIError) return response

    return {
      conversationId: response.conversationId,
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.conversation.id,
        name: response.conversation.name,
        description: response.conversation.description
          ? response.conversation.description
          : null,
        imageURL: response.conversation.imageURL
          ? response.conversation.imageURL
          : null,
        bannerImageURL: response.conversation.bannerImageURL
          ? response.conversation.bannerImageURL
          : null,
        settings: response.conversation.settings
          ? response.conversation.settings
          : null,
        membersIds: response.conversation.membersIds
          ? response.conversation.membersIds
          : null,
        mutedBy: response.conversation.mutedBy
          ? response.conversation.mutedBy
          : null,
        type: response.conversation.type,
        lastMessageSentAt: response.conversation.lastMessageSentAt
          ? response.conversation.lastMessageSentAt
          : null,
        ownerId: response.conversation.ownerId
          ? response.conversation.ownerId
          : null,
        createdAt: response.conversation.createdAt,
        updatedAt: response.conversation.updatedAt
          ? response.conversation.updatedAt
          : null,
        deletedAt: response.conversation.deletedAt
          ? response.conversation.deletedAt
          : null,
        client: this._client!,
      }),
      memberOut: new User({
        ...this._parentConfig!,
        id: response.memberOut.id,
        username: response.memberOut.username
          ? response.memberOut.username
          : null,
        did: response.memberOut.did,
        address: response.memberOut.address,
        email: response.memberOut.email ? response.memberOut.email : null,
        bio: response.memberOut.bio ? response.memberOut.bio : null,
        avatarUrl: response.memberOut.avatarUrl
          ? new URL(response.memberOut.avatarUrl)
          : null,
        isVerified: response.memberOut.isVerified
          ? response.memberOut.isVerified
          : false,
        isNft: response.memberOut.isNft ? response.memberOut.isNft : false,
        blacklistIds: response.memberOut.blacklistIds
          ? response.memberOut.blacklistIds
          : null,
        allowNotification: response.memberOut.allowNotification
          ? response.memberOut.allowNotification
          : false,
        allowNotificationSound: response.memberOut.allowNotificationSound
          ? response.memberOut.allowNotificationSound
          : false,
        visibility: response.memberOut.visibility
          ? response.memberOut.visibility
          : false,
        archivedConversations: response.memberOut.archivedConversations
          ? response.memberOut.archivedConversations
          : null,
        onlineStatus: response.memberOut.onlineStatus
          ? response.memberOut.onlineStatus
          : null,
        allowReadReceipt: response.memberOut.allowReadReceipt
          ? response.memberOut.allowReadReceipt
          : false,
        allowReceiveMessageFrom: response.memberOut.allowReceiveMessageFrom
          ? response.memberOut.allowReceiveMessageFrom
          : null,
        allowAddToGroupsFrom: response.memberOut.allowAddToGroupsFrom
          ? response.memberOut.allowAddToGroupsFrom
          : null,
        allowGroupsSuggestion: response.memberOut.allowGroupsSuggestion
          ? response.memberOut.allowGroupsSuggestion
          : false,
        e2ePublicKey: response.memberOut.e2ePublicKey
          ? response.memberOut.e2ePublicKey
          : null,
        e2eSecret: response.memberOut.e2eSecret
          ? response.memberOut.e2eSecret
          : null,
        e2eSecretIV: response.memberOut.e2eSecretIV
          ? response.memberOut.e2eSecretIV
          : null,
        createdAt: new Date(response.memberOut.createdAt),
        updatedAt: response.memberOut.updatedAt
          ? new Date(response.memberOut.updatedAt)
          : null,
        client: this._client!,
      }),
    }
  }

  /**
   * Mutes a conversation for a specified duration.
   * @param {MuteConversationArgs} args - An object containing the duration to mute the conversation for.
   * @returns {Promise<Conversation | QIError>} - A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async muteConversation(
    args: MuteConversationArgs
  ): Promise<Conversation | QIError> {
    const response = await this._mutation<
      MutationMuteConversationArgs,
      { muteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "muteConversation",
      muteConversation,
      "_mutation() -> muteConversation()",
      {
        conversationId: this.id,
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
   * Sends a message with the specified content and type.
   * @param {Pick<SendMessageArgs, "content" | "type">} args - An object containing the message content and type.
   * @returns {Promise<QIError | Message>} A promise that resolves to either a QIError if there was an error sending the message, or a Message object if the message was sent successfully.
   */
  async sendMessage(
    args: Pick<SendMessageArgs, "content" | "type">
  ): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationSendMessageArgs,
      { sendMessage: MessageGraphQL },
      MessageGraphQL
    >("sendMessage", sendMessage, "_mutation() -> sendMessage()", {
      input: {
        content: Crypto.encryptStringOrFail(
          this.findPublicKeyById(this.id),
          args.content
        ),
        conversationId: this.id,
        type: args.type,
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
      messageRootId: response.messageRootId ? response.messageRootId : null,
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
      type: response.type
        ? (response.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  /**
   * Asynchronously unarchives a conversation based on the current conversation's object.
   * If an id is provided, it throws an error.
   * @returns {Promise<User | QIError>} A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async unarchiveConversation(): Promise<User | QIError>
  async unarchiveConversation(id: string): Promise<User | QIError>
  async unarchiveConversation(id?: unknown): Promise<User | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unarchiveConversation() instead."
      )

    const response = await this._mutation<
      MutationUnarchiveConversationArgs,
      { unarchiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "unarchiveConversation",
      unarchiveConversation,
      "_mutation() -> unarchiveConversation()",
      {
        conversationId: this.id,
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

  /**
   * Asynchronously unmutes a conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<Conversation | QIError>} A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async unmuteConversation(): Promise<Conversation | QIError>
  async unmuteConversation(id: string): Promise<Conversation | QIError>
  async unmuteConversation(id?: unknown): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unarchiveConversation() instead."
      )

    const response = await this._mutation<
      MutationUnmuteConversationArgs,
      { unmuteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "unmuteConversation",
      unmuteConversation,
      "_mutation() -> unmuteConversation()",
      {
        conversationId: this.id,
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
   * Updates a conversation group with the provided arguments.
   * @param {Pick<UpdateConversationGroupInputArgs, "bannerImageURL" | "description" | "imageURL" | "name" | "settings">} args - The arguments to update the conversation group.
   * @returns {Promise<Conversation | QIError>} A promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async updateConversationGroup(
    args: Pick<
      UpdateConversationGroupInputArgs,
      "bannerImageURL" | "description" | "imageURL" | "name" | "settings"
    >
  ): Promise<Conversation | QIError> {
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
          conversationId: this.id,
          description: Crypto.encryptStringOrFail(
            this.findPublicKeyById(this.id),
            args.description
          ),
          imageURL: new URL(
            Crypto.encryptStringOrFail(
              this.findPublicKeyById(this.id),
              args.imageURL
            )
          ).toString(),
          bannerImageURL: new URL(
            Crypto.encryptStringOrFail(
              this.findPublicKeyById(this.id),
              args.bannerImageURL
            )
          ).toString(),
          name: Crypto.encryptStringOrFail(
            this.findPublicKeyById(this.id),
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

  /**
   * Asynchronously pins a conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<Conversation | QIError>} A Promise that resolves to the pinned conversation or an error.
   */
  async pinConversation(): Promise<Conversation | QIError>
  async pinConversation(id: string): Promise<Conversation | QIError>
  async pinConversation(id?: unknown): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use pinConversation() instead."
      )

    const response = await this._mutation<
      MutationAddPinToConversationArgs,
      { addPinToConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "addPinToConversation",
      addPinToConversation,
      "_mutation() -> pinConversation()",
      {
        conversationId: this.id,
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
   * Asynchronously unpins a conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<Conversation | QIError>} A Promise that resolves to the unpinned conversation or an error.
   */
  async unpinConversation(): Promise<Conversation | QIError>
  async unpinConversation(id: string): Promise<Conversation | QIError>
  async unpinConversation(id?: unknown): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unpinConversation() instead."
      )

    const response = await this._mutation<
      MutationRemovePinFromConversationArgs,
      { removePinFromConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "removePinFromConversation",
      removePinFromConversation,
      "_mutation() -> unpinConversation()",
      {
        conversationId: this.id,
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
   * Retrieves the owner information from a conversation and returns a User object.
   * @returns A Promise that resolves to a User object if successful, or a QIError object if there was an error.
   */
  async owner(): Promise<User | QIError> {
    const response = await this._query<
      null,
      {
        getConversationById: ConversationGraphQL
      },
      ConversationGraphQL
    >(
      "getConversationById",
      getOwnerFromConversationById,
      "_query() -> owner()",
      null
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.owner!.id,
      username: response.owner!.username ? response.owner!.username : null,
      did: response.owner!.did,
      address: response.owner!.address,
      email: response.owner!.email ? response.owner!.email : null,
      bio: response.owner!.bio ? response.owner!.bio : null,
      avatarUrl: response.owner!.avatarUrl
        ? new URL(response.owner!.avatarUrl)
        : null,
      isVerified: response.owner!.isVerified
        ? response.owner!.isVerified
        : false,
      isNft: response.owner!.isNft ? response.owner!.isNft : false,
      blacklistIds: response.owner!.blacklistIds
        ? response.owner!.blacklistIds
        : null,
      allowNotification: response.owner!.allowNotification
        ? response.owner!.allowNotification
        : false,
      allowNotificationSound: response.owner!.allowNotificationSound
        ? response.owner!.allowNotificationSound
        : false,
      visibility: response.owner!.visibility
        ? response.owner!.visibility
        : false,
      archivedConversations: response.owner!.archivedConversations
        ? response.owner!.archivedConversations
        : null,
      onlineStatus: response.owner!.onlineStatus
        ? response.owner!.onlineStatus
        : null,
      allowReadReceipt: response.owner!.allowReadReceipt
        ? response.owner!.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.owner!.allowReceiveMessageFrom
        ? response.owner!.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.owner!.allowAddToGroupsFrom
        ? response.owner!.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.owner!.allowGroupsSuggestion
        ? response.owner!.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.owner!.e2ePublicKey
        ? response.owner!.e2ePublicKey
        : null,
      e2eSecret: response.owner!.e2eSecret ? response.owner!.e2eSecret : null,
      e2eSecretIV: response.owner!.e2eSecretIV
        ? response.owner!.e2eSecretIV
        : null,
      createdAt: new Date(response.owner!.createdAt),
      updatedAt: response.owner!.updatedAt
        ? new Date(response.owner!.updatedAt)
        : null,
      client: this._client!,
    })
  }

  /**
   * Retrieves the conversation members from the conversation by its ID.
   * @returns A Promise that resolves to an array of ConversationMember objects or a QIError object.
   */
  async members(): Promise<ConversationMember[] | QIError> {
    const response = await this._query<
      null,
      {
        getConversationById: ConversationGraphQL
      },
      ConversationGraphQL
    >(
      "getConversationById",
      getMembersFromConversationById,
      "_query() -> members()",
      null
    )

    if (response instanceof QIError) return response

    const listConversationMembers: Array<ConversationMember> =
      response.members!.map((item) => {
        return new ConversationMember({
          ...this._parentConfig!,
          id: item!.id,
          conversationId: item!.conversationId,
          userId: item!.userId,
          type: item!.type,
          encryptedConversationPublicKey: item!.encryptedConversationPublicKey,
          encryptedConversationPrivateKey:
            item!.encryptedConversationPrivateKey,
          createdAt: item!.createdAt,
          client: this._client!,
        })
      })

    return listConversationMembers
  }

  /**
   * Retrieves a list of messages from a conversation.
   * @returns A Promise that resolves to an array of Message objects or a QIError object.
   */
  async messages(): Promise<Message[] | QIError> {
    const response = await this._query<
      null,
      {
        getConversationById: ConversationGraphQL
      },
      ConversationGraphQL
    >(
      "getConversationById",
      getMembersFromConversationById,
      "_query() -> members()",
      null
    )

    if (response instanceof QIError) return response

    const listMessages: Array<Message> = response.messages!.map((item) => {
      return new Message({
        ...this._parentConfig!,
        id: response.id,
        content: item!.content,
        conversationId: item!.conversationId,
        reactions: item!.reactions
          ? item!.reactions.map((reaction) => {
              return new Reaction({
                ...this._parentConfig!,
                userId: reaction.userId,
                content: reaction.content,
                createdAt: reaction.createdAt,
                client: this._client!,
              })
            })
          : null,
        userId: item!.userId,
        messageRoot: item!.messageRoot
          ? new Message({
              ...this._parentConfig!,
              id: item!.messageRoot.id,
              content: item!.messageRoot.content,
              conversationId: item!.messageRoot.conversationId,
              reactions: item!.messageRoot.reactions
                ? item!.messageRoot.reactions.map((reaction) => {
                    return new Reaction({
                      ...this._parentConfig!,
                      userId: reaction.userId,
                      content: reaction.content,
                      createdAt: reaction.createdAt,
                      client: this._client!,
                    })
                  })
                : null,
              userId: item!.messageRoot.userId,
              messageRoot: null,
              messageRootId: null,
              type: item!.messageRoot.type
                ? (item!.messageRoot.type as
                    | "TEXTUAL"
                    | "ATTACHMENT"
                    | "SWAP_PROPOSAL"
                    | "RENT")
                : null,
              createdAt: item!.messageRoot.createdAt,
              updatedAt: item!.messageRoot.updatedAt
                ? item!.messageRoot.updatedAt
                : null,
              deletedAt: item!.messageRoot.deletedAt
                ? item!.messageRoot.deletedAt
                : null,
              client: this._client!,
            })
          : null,
        messageRootId: item!.messageRootId ? item!.messageRootId : null,
        type: item!.type
          ? (item!.type as "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT")
          : null,
        createdAt: item!.createdAt,
        updatedAt: item!.updatedAt ? item!.updatedAt : null,
        deletedAt: item!.deletedAt ? item!.deletedAt : null,
        client: this._client!,
      })
    })

    return listMessages
  }

  getSettingsDecrypted(): Maybe<JSON> {
    if (!this.settings) return null
    return JSON.parse(
      Crypto.decryptStringOrFail(
        this.findPrivateKeyById(this.id),
        this.settings
      )
    )
  }

  getImageURLDecrypted(): Maybe<URL> {
    if (!this.imageURL) return null
    return new URL(
      Crypto.decryptStringOrFail(
        this.findPrivateKeyById(this.id),
        this.imageURL
      )
    )
  }

  getBannerImageURLDecrypted(): Maybe<URL> {
    if (!this.bannerImageURL) return null
    return new URL(
      Crypto.decryptStringOrFail(
        this.findPrivateKeyById(this.id),
        this.bannerImageURL
      )
    )
  }

  getNameDecrypted(): string {
    return Crypto.decryptStringOrFail(
      this.findPrivateKeyById(this.id),
      this.name
    )
  }

  getDescriptionDecrypted(): Maybe<string> {
    if (!this.description) return null
    return Crypto.decryptStringOrFail(
      this.findPrivateKeyById(this.id),
      this.description
    )
  }
}
