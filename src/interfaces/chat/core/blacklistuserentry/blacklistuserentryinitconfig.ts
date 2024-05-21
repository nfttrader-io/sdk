import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"
import { User } from "../../../../core/chat"

/**
 * Represents the initial configuration for a Blacklist User Entry.
 * @interface BlacklistUserEntryInitConfig
 */
export interface BlacklistUserEntryInitConfig {
  /**
   * @property {string} id - The unique identifier for the entry.
   */
  id: string
  /**
   * @property {Date} createdAt - The date and time when the entry was created.
   */
  createdAt: Date
  /**
   * @property {string} blockerId - The ID of the user who blocked another user.
   */
  blockerId: string
  /**
   * @property {string} blockedId - The ID of the user who was blocked.
   */
  blockedId: string
  /**
   * @property {Maybe<User>} blockedUser - The user who was blocked (optional).
   */
  blockedUser: Maybe<User>
  /**
   * @property {Client} client - The client associated with the entry.
   */
  client: Client
}
