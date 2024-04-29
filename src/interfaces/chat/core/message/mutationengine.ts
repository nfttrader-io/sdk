import { Message, MessageReport, QIError } from "../../../../core/chat"
import {
  AddReactionToMessageArgs,
  AddReportToMessageArgs,
  EditMessageArgs,
} from "../../schema/args"

export interface MessageMutationEngine {
  pinMessage(): Promise<Message | QIError>
  pinMessage(id: string): Promise<Message | QIError>
  addReaction(reaction: string): Promise<Message | QIError>
  addReactionToMessage(
    args: AddReactionToMessageArgs
  ): Promise<Message | QIError>
  addMessageReport(description: string): Promise<MessageReport | QIError>
  addReportToMessage(
    args: AddReportToMessageArgs
  ): Promise<MessageReport | QIError>
  editMessage(args: EditMessageArgs): Promise<Message | QIError>
  unpinMessage(): Promise<Message | QIError>
  unpinMessage(id: string): Promise<Message | QIError>
  removeReaction(): Promise<Message | QIError>
  removeReaction(messageId: string): Promise<Message | QIError>
}
