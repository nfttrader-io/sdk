import { Client } from "@urql/core"

/**
 * Interface for the configuration of a reaction initialization.
 * @type ReactionInitConfig
 */
export type ReactionInitConfig = {
  /**
   * @property {string} content - The content of the reaction.
   */
  content: string
  /**
   * @property {Date} createdAt - The date and time when the reaction was created.
   */
  createdAt: Date
  /**
   * @property {string} userId - The ID of the user who created the reaction.
   */
  userId: string
  /**
   * @property {Client} client - The client associated with the reaction.
   */
  client: Client
}
