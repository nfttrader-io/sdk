import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"

/**
 * Interface for initializing a conversation report.
 * @type ConversationReportInitConfig
 */
export type ConversationReportInitConfig = {
  /**
   * @property {string} id - The unique identifier for the conversation report.
   */
  id: string
  /**
   * @property {Maybe<string>} description - The description of the conversation report (optional).
   */
  description: Maybe<string>
  /**
   * @property {Maybe<string>} userId - The user ID associated with the conversation report (optional).
   */
  userId: Maybe<string>
  /**
   * @property {Date} createdAt - The date and time when the conversation report was created.
   */
  createdAt: Date
  /**
   * @property {Client} client - The client object associated with the conversation report.
   */
  client: Client
}
