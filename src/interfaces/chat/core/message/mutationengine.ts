import { Message, MessageReport, QIError } from "../../../../core/chat"
import {
  AddReactionToMessageArgs,
  AddReportToMessageArgs,
  EditMessageArgs,
  RemoveReactionFromMessageArgs,
} from "../../schema/args"

/**
 * Interface for a message mutation engine that defines methods for mutating messages.
 * @interface MessageMutationEngine
 */
export interface MessageMutationEngine {
  pinMessage(): Promise<Message | QIError>
  pinMessage(id: string): Promise<Message | QIError>
  addReactionToMessage(
    args: AddReactionToMessageArgs
  ): Promise<Message | QIError>
  addReportToMessage(
    args: AddReportToMessageArgs
  ): Promise<MessageReport | QIError>
  editMessage(args: EditMessageArgs): Promise<Message | QIError>
  unpinMessage(): Promise<Message | QIError>
  unpinMessage(id: string): Promise<Message | QIError>
  removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs
  ): Promise<Message | QIError>
  markImportantMessage(): Promise<Message | QIError>
  markImportantMessage(id: string): Promise<Message | QIError>
  unmarkImportantMessage(): Promise<Message | QIError>
  unmarkImportantMessage(id: string): Promise<Message | QIError>
}
