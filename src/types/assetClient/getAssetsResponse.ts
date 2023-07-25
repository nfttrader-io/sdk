import Collection from "../postClient/collection"

export default interface GetAssetsResponse {
  data: Array<{ count: number; rows: Array<Collection> }>
}
