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
} from "../../graphql/generated/graphql"
import { EngineInitConfig } from "../../interfaces/chat/core"
import {
  ConversationMutationEngine,
  ConversationQueryEngine,
} from "../../interfaces/chat/core/conversation"
import { ConversationInitConfig } from "../../interfaces/chat/core/conversation/conversationinitconfig"
import { ConversationSchema } from "../../interfaces/chat/schema"
import {
  AddMembersToConversationArgs,
  AddReportToConversationArgs,
  EjectMemberArgs,
  MuteConversationArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
} from "../../interfaces/chat/schema/args"
import Maybe from "../../types/general/maybe"
import { ConversationMember } from "./conversationmember"
import { ConversationReport } from "./conversationreport"
import { Engine } from "./engine"
import { Message } from "./message"
import { QIError } from "./qierror"
import { User } from "./user"

export class Conversation
  extends Engine
  implements
    ConversationSchema,
    ConversationQueryEngine,
    ConversationMutationEngine
{
  readonly id: string
  readonly name: string
  readonly description: Maybe<string>
  readonly imageURL: Maybe<URL>
  readonly bannerImageURL: Maybe<URL>
  readonly settings: Maybe<JSON>
  readonly membersIds: Maybe<Array<Maybe<string>>>
  readonly type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  readonly lastMessageSentAt: Maybe<Date>
  readonly ownerId: Maybe<string>
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>
  readonly deletedAt: Maybe<Date>

  constructor(config: ConversationInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      e2e: config.e2e,
    })

    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.imageURL = config.imageURL
    this.bannerImageURL = config.bannerImageURL
    this.settings = config.settings
    this.membersIds = config.membersIds
    this.type = config.type
    this.lastMessageSentAt = config.lastMessageSentAt
    this.ownerId = config.ownerId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt

    this._client = config.client
  }

  async ejectMember(
    args: Pick<EjectMemberArgs, "userId">
  ): Promise<Conversation | QIError> {
    const response = await this._mutation<
      MutationEjectMemberArgs,
      { ejectMember: ConversationGraphQL },
      ConversationGraphQL
    >("ejectMember", ejectMember, "_mutation() -> ejectMember()", {
      input: {
        conversationId: this.id,
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

  async addMembersToConversation(
    args: Pick<AddMembersToConversationArgs, "membersIds">
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
          membersIds: args.membersIds,
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

  async archiveConversation(): Promise<Conversation | QIError>
  async archiveConversation(id: string): Promise<Conversation | QIError>
  async archiveConversation(id?: unknown): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use archiveConversation() instead."
      )

    const response = await this._mutation<
      MutationArchiveConversationArgs,
      { archiveConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "archiveConversation",
      archiveConversation,
      "_mutation() -> archiveConversation()",
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

  async leaveConversation(): Promise<Conversation | QIError>
  async leaveConversation(id: string): Promise<Conversation | QIError>
  async leaveConversation(id?: unknown): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use leaveConversation() instead."
      )

    const response = await this._mutation<
      MutationLeaveConversationArgs,
      { leaveConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "leaveConversation",
      leaveConversation,
      "_mutation() -> leaveConversation()",
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
    args: Pick<MuteConversationArgs, "duration">
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
        input: {
          conversationId: this.id,
          duration: args.duration,
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

  async sendMessage(
    args: Pick<SendMessageArgs, "content" | "type">
  ): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationSendMessageArgs,
      { sendMessage: MessageGraphQL },
      MessageGraphQL
    >("sendMessage", sendMessage, "_mutation() -> sendMessage()", {
      input: {
        content: args.content,
        conversationId: this.id,
        type: args.type,
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

  async unarchiveConversation(): Promise<Conversation | QIError>
  async unarchiveConversation(id: string): Promise<Conversation | QIError>
  async unarchiveConversation(id?: unknown): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unarchiveConversation() instead."
      )

    const response = await this._mutation<
      MutationUnarchiveConversationArgs,
      { unarchiveConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "unarchiveConversation",
      unarchiveConversation,
      "_mutation() -> unarchiveConversation()",
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
          description: args.description,
          imageURL: new URL(args.imageURL).toString(),
          bannerImageURL: new URL(args.bannerImageURL).toString(),
          name: args.name,
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

  async owner(): Promise<User | QIError> {
    return new Promise(() => {})
  }

  async members(): Promise<QIError> {
    return new Promise(() => {})
  }

  async reports(): Promise<QIError> {
    return new Promise(() => {})
  }

  async mutedBy(): Promise<QIError> {
    return new Promise(() => {})
  }

  async messages(): Promise<QIError> {
    return new Promise(() => {})
  }
}
