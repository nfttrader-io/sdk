import POST_STATUS from "../../enums/postClient/postStatus"
import POST_TYPE from "../../enums/postClient/postType"

export default interface ListPostsFilter {
  owner: string
  /**
   * Filter posts that contains at least `collections` collections
   */
  collections: string | Array<string>
  /**
   * Filter posts based on status, possible statuses are:
   * - `ACTIVE`
   * - `COMPLETED`
   * - `EXPIRED`
   * - `CANCELED`
   * - `RESERVED`
   */
  status: POST_STATUS
  /**
   * Filter posts based on type, possible types are:
   * - `A1`
   * - `A2`
   * - `B1`
   * - `B2`
   * - `C1`
   */
  type: POST_TYPE
  /**
   * Filter posts...
   */
  typeOffered: `${0 | 1}${0 | 1}${0 | 1}${0 | 1}`
  /**
   * Filter posts...
   */
  typeWanted: `${0 | 1}${0 | 1}${0 | 1}${0 | 1}`
  /**
   * Filter posts based on their assets, `verified` returns only posts with all verified collections
   */
  verified: boolean
  networks:
    | "ETHEREUM"
    | "POLYGON"
    | "MUMBAI"
    | Array<"ETHEREUM" | "POLYGON" | "MUMBAI">
  /**
   * Filter posts based on `hotdeal` number of answers
   */
  hotdeal: number
  /**
   * Filter based on timestamp
   */
  timestamp: number
}
