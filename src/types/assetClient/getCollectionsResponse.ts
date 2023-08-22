import Collection from "../postClient/collection"

export default interface GetCollectionsResponse {
  data: Array<{ count: number; rows: Array<Collection> }>
}
