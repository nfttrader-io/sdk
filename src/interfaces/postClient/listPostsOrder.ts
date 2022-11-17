export default interface ListPostsOrder {
  field: "date" | "expirationDate" | "offered" | "wanted"
  direction: "ASC" | "DESC"
}
