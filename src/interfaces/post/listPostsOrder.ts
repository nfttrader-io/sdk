/**
 * Defines the order in which to list posts based on a specified field and direction.
 * @interface ListPostsOrder
 */
export interface ListPostsOrder {
  /**
   * @property {("creationDate" | "expirationDate" | "assetsOffered" | "assetsWanted")} field - The field to order the posts by.
   */
  field: "creationDate" | "expirationDate" | "assetsOffered" | "assetsWanted"
  /**
   * @property {("ASC" | "DESC")} [direction] - The direction in which to order the posts (optional, defaults to "ASC").
   */
  direction?: "ASC" | "DESC"
}
