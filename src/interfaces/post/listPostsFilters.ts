import { BitmapOffered, BitmapWanted, Network } from "../../types/base"
import {
  PostStatus,
  PostStatusName,
  PostType,
  PostTypeName,
} from "../../types/post"

/**
 * Interface representing filters that can be applied when listing posts.
 * @interface ListPostsFilters
 */
export interface ListPostsFilters {
  /**
   * @property {string | undefined} [owner] - Filters posts owned by `owner` username or address (optional).
   */
  owner?: string
  /**
   * @property {Array<{ address: string; network: Network }>} [collections] - Filters posts that contains at least one `collection` address in the relative network (optional).
   *
   * Can be:
   * - An array of addresses and networks
   */
  collections?: Array<{ address: string; network: Network }>
  /**
   * @property {PostStatusName | PostStatus[PostStatusName]} [status] - Filters posts based on status, to see possible statuses visit (optional) [this link](https://docs.nfttrader.io).
   */
  status?: PostStatusName | PostStatus[PostStatusName]
  /**
   * @property {PostTypeName | PostType[PostTypeName]} [type] - Filters posts based on type, to see possible types visit (optional) [this link](https://docs.nfttrader.io).
   */
  type?: PostTypeName | PostType[PostTypeName]
  /**
   * @property {BitmapOffered} [typeOffered] - Filters posts by the BitmapOffered pattern (optional).
   */
  typeOffered?: BitmapOffered
  /**
   * @property {BitmapWanted} [typeWanted] - Filters posts by the BitmapWanted pattern (optional).
   */
  typeWanted?: BitmapWanted
  /**
   * @property {boolean} [verified] - Filters posts based on their assets, `verified` returns only posts with all verified collections (optional).
   */
  verified?: boolean
  /**
   * @property {Network} [network] - Filters posts based on their network, to see possible networks visit [this link](https://docs.nfttrader.io).
   */
  network?: Network
  /**
   * @property {number} [offers] - Filters posts that have at least `offers` number of answers (optional).
   */
  offers?: number
  /**
   * @property {number} [expirationDate] - Filters posts that are going to expire before or at `expirationDate` timestamp (optional).
   */
  expirationDate?: number
  /**
   * @property {boolean} [includeParent] - Filters posts that has a parent post (optional).
   */
  includeParent?: boolean
}
