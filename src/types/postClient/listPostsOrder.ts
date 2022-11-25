export default interface ListPostsOrder {
  field: "creationDate" | "expirationDate" | "assetsOffered" | "assetsWanted"
  /**
   * Order direction, can be ascendent(`ASC`) or descendent(`DESC`). Defaults to `ASC`
   */
  direction?: "ASC" | "DESC"
}
