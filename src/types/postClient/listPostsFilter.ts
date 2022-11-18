import POST_STATUS from "../../enums/postClient/postStatus"
import POST_TYPE from "../../enums/postClient/postType"
import Bitmap from "../general/bitmap"
import Network from "../general/network"

export default interface ListPostsFilter {
  owner?: string
  /**
   * Filter posts that contains at least `collections` collections
   */
  collections?: string | Array<string>
  /**
   * Filter posts based on status, possible statuses are:
   * - `ACTIVE`
   * - `COMPLETED`
   * - `EXPIRED`
   * - `CANCELED`
   * - `RESERVED`
   */
  status?: POST_STATUS
  /**
   * Filter posts based on type, possible types are:
   * - `A1`
   * - `A2`
   * - `B1`
   * - `B2`
   * - `C1`
   */
  type?: POST_TYPE
  /**
   * Filter posts...
   */
  typeOffered?: Bitmap
  /**
   * Filter posts...
   */
  typeWanted?: Bitmap
  /**
   * Filter posts based on their assets, `verified` returns only posts with all verified collections
   */
  verified?: boolean
  networks?: Network | Array<Network>
  /**
   * Filter posts that have at least `deals` number of answers
   */
  deals?: number
  /**
   * Filter based on timestamp
   */
  expirationDate?: string
}
