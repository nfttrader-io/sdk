export default interface ListPostsOrder {
  field: "date" | "expirationDate" | "offered" | "wanted"
  /**
   * Order direction, can be ascendent(`ASC`) or descendent(`DESC`). Defaults to `ASC`
   */
  direction?: "ASC" | "DESC"
}
