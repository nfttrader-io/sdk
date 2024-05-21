import {
  Conversation,
  ConversationPin,
  Message,
  MessageImportant,
  QIError,
  User,
} from "../../../../core/chat"
import { Maybe } from "../../../../types/base"
import {
  FindUsersByUsernameOrAddressArgs,
  ListAllActiveUserConversationIdsArgs,
  ListMessagesByConversationIdArgs,
  ListMessagesImportantByUserConversationIdArgs,
} from "../../schema/args"

/**
 * Interface for a User Query Engine that provides methods to interact with user conversations and messages.
 * @interface UAQueryEngine
 */
export interface UAQueryEngine {
  listAllActiveUserConversationIds(
    args: ListAllActiveUserConversationIdsArgs
  ): Promise<
    | {
        items: Array<string>
        nextToken?: String
      }
    | QIError
  >
  listConversationsByIds(
    ids: Array<string>
  ): Promise<
    | { items: Array<Conversation>; unprocessedKeys?: Maybe<Maybe<string>[]> }
    | QIError
  >
  listMessagesByConversationId(
    args: ListMessagesByConversationIdArgs
  ): Promise<{ items: Array<Message>; nextToken?: Maybe<string> } | QIError>
  listMessagesImportantByUserConversationId(
    args: ListMessagesImportantByUserConversationIdArgs
  ): Promise<
    { items: Array<MessageImportant>; nextToken?: Maybe<string> } | QIError
  >
  listConversationsPinnedByCurrentUser(
    nextToken?: string
  ): Promise<
    { items: Array<ConversationPin>; nextToken?: Maybe<string> } | QIError
  >
  getConversationById(id: string): Promise<Conversation | QIError>
  findUsersByUsernameOrAddress(
    args: FindUsersByUsernameOrAddressArgs
  ): Promise<{ items: Array<User>; nextToken?: String } | QIError>
  getCurrentUser(): Promise<User | QIError>
}
