import { Conversation, QIError, User } from "../../../../core/chat"
import { KeyPairItem } from "../../../../types/chat/keypairitem"
import {
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
  UpdateUserArgs,
} from "../../schema/args"

export interface UAMutationEngine {
  archiveConversations(
    ids: Array<string>
  ): Promise<
    { concatConversationIds: string; items: Array<{ id: string }> } | QIError
  >
  createConversationGroup(
    args: CreateConversationGroupArgs
  ): Promise<{ keypairItem: KeyPairItem; conversation: Conversation } | QIError>
  createConversationOneToOne(
    args: CreateConversationOneToOneArgs
  ): Promise<{ keypairItem: KeyPairItem; conversation: Conversation } | QIError>
  deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs
  ): Promise<Boolean | QIError>
  eraseConversationByAdmin(
    id: string
  ): Promise<{ conversationId: string; items: Array<{ id: string }> } | QIError>
  unarchiveConversations(
    ids: Array<string>
  ): Promise<
    { concatConversationIds: string; items: Array<{ id: string }> } | QIError
  >
  updateUser(args: UpdateUserArgs): Promise<User | QIError>
}
