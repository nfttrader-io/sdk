import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"

/**
 * Represents the initialization configuration for a conversation member.
 * @interface ConversationMemberInitConfig
 */
export interface ConversationMemberInitConfig {
  /**
   * @property {string} id - The unique identifier of the conversation member.
   */
  id: string
  /**
   * @property {Maybe<string>} conversationId - The ID of the conversation the member belongs to.
   */
  conversationId: Maybe<string>
  /**
   * @property {string} userId - The ID of the user who is a member of the conversation.
   */
  userId: string
  /**
   * @property {"USER" | "ADMINISTRATOR"} type - The type of the conversation member (either "USER" or "ADMINISTRATOR").
   */
  type: "USER" | "ADMINISTRATOR"
  /**
   * @property {string} encryptedConversationPublicKey - The public key used for encryption in the conversation.
   */
  encryptedConversationPublicKey: string
  /**
   * @property {string} encryptedConversationPrivateKey - The private key used for encryption in the conversation.
   */
  encryptedConversationPrivateKey: string
  /**
   * @property {Maybe<Date>} createdAt - The optional creation date of the client.
   */
  createdAt: Maybe<Date>
  /**
   * @property {Client} client - The client object.
   */
  client: Client
}
