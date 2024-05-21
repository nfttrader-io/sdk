import { Maybe } from "../../../types/base"

/**
 * Represents the schema for a message report.
 * @interface MessageReportSchema
 */
export interface MessageReportSchema {
  /**
   * @property {string} id - The unique identifier of the message report.
   */
  id: string
  /**
   * @property {string} description - The description of the message report.
   */
  description: string
  /**
   * @property {Maybe<string>} userId - The user ID associated with the message report.
   */
  userId: Maybe<string>
  /**
   * @property {Date} createdAt - The date and time when the message report was created.
   */
  createdAt: Date
}
