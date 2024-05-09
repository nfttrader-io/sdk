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
import { Engine } from "./engine"
import { MessageReport } from "./messagereport"
import { QIError } from "./qierror"

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
    throw new Error("Method not implemented.")
  }

  async addReactionToMessage(
    args: AddReactionToMessageArgs
  ): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async addReportToMessage(
    args: AddReportToMessageArgs
  ): Promise<QIError | MessageReport> {
    throw new Error("Method not implemented.")
  }

  async editMessage(args: EditMessageArgs): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async unpinMessage(): Promise<Message | QIError>
  async unpinMessage(id: string): Promise<Message | QIError>
  async unpinMessage(id?: unknown): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs
  ): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async markImportantMessage(): Promise<Message | QIError>
  async markImportantMessage(id: string): Promise<Message | QIError>
  async markImportantMessage(id?: unknown): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async unmarkImportantMessage(): Promise<Message | QIError>
  async unmarkImportantMessage(id: string): Promise<Message | QIError>
  async unmarkImportantMessage(id?: unknown): Promise<Message | QIError> {
    throw new Error("Method not implemented.")
  }

  async conversation(): Promise<QIError> {
    return new Promise(() => {})
  }

  async messageRoot(): Promise<QIError> {
    return new Promise(() => {})
  }

  async pin(): Promise<QIError> {
    return new Promise(() => {})
  }

  async reactions(): Promise<QIError> {
    return new Promise(() => {})
  }

  async reports(): Promise<QIError> {
    return new Promise(() => {})
  }

  async user(): Promise<QIError> {
    return new Promise(() => {})
  }
}
