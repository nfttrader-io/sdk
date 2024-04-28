import { Conversation, QIError } from "../../../../core/chat"
import {
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
} from "../../schema/args"

export interface UAMutationEngine {
  archiveConversations(
    ids: Array<string>
  ): Promise<
    { concatConversationIds: string; items: Array<{ id: string }> } | QIError
  >
  createConversationGroup(
    args: CreateConversationGroupArgs
  ): Promise<Conversation | QIError>
  createConversationOneToOne(
    args: CreateConversationOneToOneArgs
  ): Promise<Conversation | QIError>
  deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs
  ): Promise<Boolean | QIError>
  eraseConversationByAdmin(
    id: string
  ): Promise<{ conversationId: string; items: Array<{ id: string }> } | QIError>
}
