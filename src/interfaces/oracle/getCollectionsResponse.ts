import Collection from "../post/collection"

export default interface GetCollectionsResponse {
  data: Array<{ count: number; rows: Array<Collection> }>
}
