/**
 * Represents the response object when fetching collections.
 * @interface Collection
 */
import { Collection } from "../post"

export interface GetCollectionsResponse {
  /**
   * @property {Array<{ count: number; rows: Array<Collection> }>} data - represent the response object.
   */
  data: Array<{ count: number; rows: Array<Collection> }>
}
