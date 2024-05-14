import {
  addImportantToMessage,
  addPinToMessage,
  addReactionToMessage,
  addReportToMessage,
  editMessage,
  removeImportantFromMessage,
  removePinFromMessage,
  removeReactionFromMessage,
} from "../../constants/chat/mutations"
import {
  getConversationFromMessageById,
  getMessageRootFromMessageById,
  getReactionsFromMessageById,
  getUserFromMessageById,
} from "../../constants/chat/queries"
import {
  MutationAddPinToMessageArgs,
  Message as MessageGraphQL,
  MessageReport as MessageReportGraphQL,
  MutationAddReactionToMessageArgs,
  MutationAddReportToMessageArgs,
  MutationEditMessageArgs,
  MutationRemovePinFromMessageArgs,
  MutationRemoveReactionFromMessageArgs,
  MutationAddImportantToMessageArgs,
  MutationRemoveImportantFromMessageArgs,
} from "../../graphql/generated/graphql"
import { EngineInitConfig } from "../../interfaces/chat/core"
import {
  MessageInitConfig,
  MessageMutationEngine,
} from "../../interfaces/chat/core/message"
import { MessageSchema } from "../../interfaces/chat/schema"
import {
  AddReactionToMessageArgs,
  AddReportToMessageArgs,
  EditMessageArgs,
  RemoveReactionFromMessageArgs,
} from "../../interfaces/chat/schema/args"
import Maybe from "../../types/general/maybe"
import { Conversation } from "./conversation"
import { Engine } from "./engine"
import { MessageReport } from "./messagereport"
import { QIError } from "./qierror"
import { Reaction } from "./reaction"
import { User } from "./user"

export class Message
  extends Engine
  implements MessageSchema, MessageMutationEngine
{
  readonly id: string
  readonly content: string
  readonly conversationId: Maybe<string>
  readonly userId: Maybe<string>
  readonly messageRootId: Maybe<string>
  readonly type: Maybe<"TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT">
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>
  readonly deletedAt: Maybe<Date>

  constructor(config: MessageInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      e2e: config.e2e,
    })

    this.id = config.id
    this.content = config.content
    this.conversationId = config.conversationId
    this.userId = config.userId
    this.messageRootId = config.messageRootId
    this.type = config.type
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt
    this._client = config.client
  }

  async pinMessage(): Promise<Message | QIError>
  async pinMessage(id: string): Promise<Message | QIError>
  async pinMessage(id?: unknown): Promise<Message | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use pinMessage() instead."
      )

    const response = await this._mutation<
      MutationAddPinToMessageArgs,
      { addPinToMessage: MessageGraphQL },
      MessageGraphQL
    >("addPinToMessage", addPinToMessage, "_mutation() -> pinMessage()", {
      messageId: this.id,
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

  async addReactionToMessage(
    args: Pick<AddReactionToMessageArgs, "reaction">
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
          messageId: this.id,
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

  async addReportToMessage(
    args: Pick<AddReportToMessageArgs, "description">
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
          messageId: this.id,
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

  async editMessage(
    args: Pick<EditMessageArgs, "content">
  ): Promise<Message | QIError> {
    const response = await this._mutation<
      MutationEditMessageArgs,
      { editMessage: MessageGraphQL },
      MessageGraphQL
    >("editMessage", editMessage, "_mutation() -> editMessage()", {
      input: {
        messageId: this.id,
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

  async unpinMessage(): Promise<Message | QIError>
  async unpinMessage(id: string): Promise<Message | QIError>
  async unpinMessage(id?: unknown): Promise<Message | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unpinMessage() instead."
      )

    const response = await this._mutation<
      MutationRemovePinFromMessageArgs,
      { removePinFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removePinFromMessage",
      removePinFromMessage,
      "_mutation() -> unpinMessage()",
      {
        messageId: this.id,
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

  async removeReactionFromMessage(
    args: Pick<RemoveReactionFromMessageArgs, "reaction">
  ): Promise<Message | QIError> {
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
          reactionContent: args.reaction,
          messageId: this.id,
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

  async markImportantMessage(): Promise<Message | QIError>
  async markImportantMessage(id: string): Promise<Message | QIError>
  async markImportantMessage(id?: unknown): Promise<Message | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use markImportantMessage() instead."
      )

    const response = await this._mutation<
      MutationAddImportantToMessageArgs,
      { addImportantToMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "addImportantToMessage",
      addImportantToMessage,
      "_mutation() -> markImportantMessage()",
      {
        messageId: this.id,
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

  async unmarkImportantMessage(): Promise<Message | QIError>
  async unmarkImportantMessage(id: string): Promise<Message | QIError>
  async unmarkImportantMessage(id?: unknown): Promise<Message | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unmarkImportantMessage() instead."
      )

    const response = await this._mutation<
      MutationRemoveImportantFromMessageArgs,
      { removeImportantFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removeImportantFromMessage",
      removeImportantFromMessage,
      "_mutation() -> removeImportantFromMessage()",
      {
        messageId: this.id,
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

  async conversation(): Promise<Conversation | QIError> {
    const response = await this._query<
      null,
      {
        getMessageById: MessageGraphQL
      },
      MessageGraphQL
    >(
      "getMessageById",
      getConversationFromMessageById,
      "_query() -> conversation()",
      null
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.conversation!.id,
      name: response.conversation!.name,
      description: response.conversation!.description
        ? response.conversation!.description
        : null,
      imageURL: response.conversation!.imageURL
        ? new URL(response.conversation!.imageURL)
        : null,
      bannerImageURL: response.conversation!.bannerImageURL
        ? new URL(response.conversation!.bannerImageURL)
        : null,
      settings: response.conversation!.settings
        ? JSON.parse(response.conversation!.settings)
        : null,
      membersIds: response.conversation!.membersIds
        ? response.conversation!.membersIds
        : null,
      type: response.conversation!.type,
      lastMessageSentAt: response.conversation!.lastMessageSentAt
        ? response.conversation!.lastMessageSentAt
        : null,
      ownerId: response.conversation!.ownerId
        ? response.conversation!.ownerId
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
    })
  }

  async messageRoot(): Promise<Message | QIError> {
    const response = await this._query<
      null,
      {
        getMessageById: MessageGraphQL
      },
      MessageGraphQL
    >(
      "getMessageById",
      getMessageRootFromMessageById,
      "_query() -> messageRoot()",
      null
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.messageRoot!.id,
      content: response.messageRoot!.content,
      conversationId: response.messageRoot!.conversation
        ? response.messageRoot!.conversationId
        : null,
      userId: response.messageRoot!.userId
        ? response.messageRoot!.userId
        : null,
      messageRootId: response.messageRoot!.messageRootId
        ? response.messageRoot!.messageRootId
        : null,
      type: response.messageRoot!.type
        ? (response.messageRoot!.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "SWAP_PROPOSAL"
            | "RENT")
        : null,
      createdAt: response.messageRoot!.createdAt,
      updatedAt: response.messageRoot!.updatedAt
        ? response.messageRoot!.updatedAt
        : null,
      deletedAt: response.messageRoot!.deletedAt
        ? response.messageRoot!.deletedAt
        : null,

      client: this._client!,
    })
  }

  async reactions(): Promise<Array<Reaction> | QIError> {
    const response = await this._query<
      null,
      {
        getMessageById: MessageGraphQL
      },
      MessageGraphQL
    >(
      "getMessageById",
      getReactionsFromMessageById,
      "_query() -> reactions()",
      null
    )

    if (response instanceof QIError) return response

    const reactions: Array<Reaction> = []

    response.reactions?.forEach((item) => {
      if (item)
        reactions.push(
          new Reaction({
            ...this._parentConfig!,
            content: item.content,
            createdAt: item.createdAt,
            userId: item.userId,
            client: this._client!,
          })
        )
    })

    return reactions
  }

  async user(): Promise<User | QIError> {
    const response = await this._query<
      null,
      {
        getMessageById: MessageGraphQL
      },
      MessageGraphQL
    >("getMessageById", getUserFromMessageById, "_query() -> user()", null)

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.user!.id,
      username: response.user!.username ? response.user!.username : null,
      address: response.user!.address,
      email: response.user!.email ? response.user!.email : null,
      bio: response.user!.bio ? response.user!.bio : null,
      avatarUrl: response.user!.avatarUrl
        ? new URL(response.user!.avatarUrl)
        : null,
      isVerified: response.user!.isVerified ? response.user!.isVerified : false,
      isNft: response.user!.isNft ? response.user!.isNft : false,
      blacklistIds: response.user!.blacklistIds
        ? response.user!.blacklistIds
        : null,
      allowNotification: response.user!.allowNotification
        ? response.user!.allowNotification
        : false,
      allowNotificationSound: response.user!.allowNotificationSound
        ? response.user!.allowNotificationSound
        : false,
      visibility: response.user!.visibility ? response.user!.visibility : false,
      onlineStatus: response.user!.onlineStatus
        ? response.user!.onlineStatus
        : null,
      allowReadReceipt: response.user!.allowReadReceipt
        ? response.user!.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.user!.allowReceiveMessageFrom
        ? response.user!.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.user!.allowAddToGroupsFrom
        ? response.user!.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.user!.allowGroupsSuggestion
        ? response.user!.allowGroupsSuggestion
        : false,
      encryptedPrivateKey: response.user!.encryptedPrivateKey
        ? response.user!.encryptedPrivateKey
        : null,
      publicKey: response.user!.publicKey ? response.user!.publicKey : null,
      createdAt: new Date(response.user!.createdAt),
      updatedAt: response.user!.updatedAt
        ? new Date(response.user!.updatedAt)
        : null,
      client: this._client!,
    })
  }
}
