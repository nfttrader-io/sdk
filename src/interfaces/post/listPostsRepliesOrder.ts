/**
 * Defines the order in which replies to posts should be listed.
 * @interface ListPostsRepliesOrder
 */
export interface ListPostsRepliesOrder {
  /**
   * @property {string} field - The field by which the replies should be ordered. Can be "creationDate" or "score".
   */
  field: "creationDate" | "score"
  /**
   * @property {string} [direction=ASC] - The direction in which the replies should be ordered. Can be "ASC" (ascending) or "DESC" (descending).
   */
  direction?: "ASC" | "DESC"
}
