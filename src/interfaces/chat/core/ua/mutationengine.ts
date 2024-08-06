import { Conversation, QIError, User } from "../../../../core/chat"
import { KeyPairItem } from "../../../../types/chat/keypairitem"
import {
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
  UpdateUserArgs,
} from "../../../../types/chat/schema/args"

/**
 * Interface for a User Activity Mutation Engine that defines methods for mutating conversations and users.
 * @interface UAMutationEngine
 */
export interface UAMutationEngine {
  archiveConversations(ids: Array<string>): Promise<User | QIError>
  createConversationGroup(args: CreateConversationGroupArgs): Promise<
    | {
        keypairItem: KeyPairItem | null
        /* | null is to remove */ conversation: Conversation
      }
    | QIError
  >
  createConversationOneToOne(args: CreateConversationOneToOneArgs): Promise<
    | {
        keypairItem: KeyPairItem | null
        /* | null is to remove */ conversation: Conversation
      }
    | QIError
  >
  deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs
  ): Promise<{ conversationId: string; messagesIds: string[] } | QIError>
  eraseConversationByAdmin(
    id: string
  ): Promise<{ conversationId: string; items: Array<{ id: string }> } | QIError>
  unarchiveConversations(ids: Array<string>): Promise<User | QIError>
  updateUser(args: UpdateUserArgs): Promise<User | QIError>
}
