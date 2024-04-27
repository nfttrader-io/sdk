import { Message, MessageReport, QIError } from "../../../../core/chat"
import {
  AddReactionToMessageArgs,
  AddReportToMessageArgs,
} from "../../schema/args"

export interface MessageMutationEngine {
  addPin(): Promise<Message | QIError>
  addPinToMessage(id: string): Promise<Message | QIError>
  addReaction(reaction: string): Promise<Message | QIError>
  addReactionToMessage(
    args: AddReactionToMessageArgs
  ): Promise<Message | QIError>
  addMessageReport(description: string): Promise<MessageReport | QIError>
  addReportToMessage(
    args: AddReportToMessageArgs
  ): Promise<MessageReport | QIError>
}
