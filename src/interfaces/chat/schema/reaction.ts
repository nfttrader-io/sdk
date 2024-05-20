/**
 * Interface for defining the schema of a reaction object.
 * @interface ReactionSchema
 */
export interface ReactionSchema {
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
}
