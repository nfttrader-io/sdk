import Maybe from "../../../types/general/maybe"

/**
 * Interface for defining the schema of a conversation report.
 * @interface ConversationReportSchema
 */
export interface ConversationReportSchema {
  /**
   *  @property {string} id - The unique identifier of the conversation report.
   */
  id: string
  /**
   *  @property {Maybe<string>} description - The description of the conversation report.
   */
  description: Maybe<string>
  /**
   *  @property {Maybe<string>} userId - The user ID associated with the conversation report.
   */
  userId: Maybe<string>
  /**
   *  @property {Date} createdAt - The date and time when the conversation report was created.
   */
  createdAt: Date
}
