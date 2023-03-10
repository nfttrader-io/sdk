export default interface ListPostsRepliesOrder {
  field: "creationDate" | "score"
  /**
   * Order direction, can be ascendent(`ASC`) or descendent(`DESC`). Defaults to `ASC`
   */
  direction?: "ASC" | "DESC"
}
