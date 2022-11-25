import POST_STATUS from "../../enums/postClient/postStatus"
import POST_TYPE from "../../enums/postClient/postType"
import Bitmap from "../general/bitmap"
import Network from "../general/network"

export default interface ListPostsFilter {
  /**
   * Filter posts owned by `owner` username or address
   */
  owner?: string
  /**
   * Filter posts that contains at least one `collections` address.
   *
   * Can be:
   * - A single address (string)
   * - An array of addresses (Array<string>)
   * - An object that specify if the specified addresses are wanted to be searched in `wanted` or `offered` `Post.assets`
   */
  collections?:
    | string
    | Array<string>
    | Partial<{
        wanted?: string | Array<string>
        offered?: string | Array<string>
      }>
  /**
   * Filter posts based on status, to see possible statuses visit [this link](https://www.google.com)
   */
  status?: POST_STATUS
  /**
   * Filter posts based on type, to see possible types visit [this link](https://www.google.com)
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
  /**
   * Filter posts based on their network, to see possible networks visit [this link](https://www.google.com)
   */
  networks?: Network | Array<Network>
  /**
   * Filter posts that have at least `deals` number of answers
   */
  deals?: number
  /**
   * Filter posts that are going to expire before or at `expirationDate` timestamp
   */
  expirationDate?: number
}
