import BitmapOffered from "../../types/general/bitmapOffered"
import BitmapWanted from "../../types/general/bitmapWanted"
import Network from "../../types/general/network"
import { PostStatus } from "../../types/post/poststatus"
import { PostStatusName } from "../../types/post/poststatusname"
import { PostType } from "../../types/post/posttype"
import { PostTypeName } from "../../types/post/posttypename"

export interface ListPostsFilters {
  /**
   * Filter posts owned by `owner` username or address
   */
  owner?: string
  /**
   * Filter posts that contains at least one `collection` address in the relative network.
   *
   * Can be:
   * - An array of addresses and networks
   */
  collections?: Array<{ address: string; network: Network }>
  /**
   * Filter posts based on status, to see possible statuses visit [this link](https://docs.nfttrader.io)
   */
  status?: PostStatusName | PostStatus[PostStatusName]
  /**
   * Filter posts based on type, to see possible types visit [this link](https://docs.nfttrader.io)
   */
  type?: PostTypeName | PostType[PostTypeName]
  /**
   * Filter posts...
   */
  typeOffered?: BitmapOffered
  /**
   * Filter posts...
   */
  typeWanted?: BitmapWanted
  /**
   * Filter posts based on their assets, `verified` returns only posts with all verified collections
   */
  verified?: boolean
  /**
   * Filter posts based on their network, to see possible networks visit [this link](https://docs.nfttrader.io)
   */
  network?: Network
  /**
   * Filter posts that have at least `offers` number of answers
   */
  offers?: number
  /**
   * Filter posts that are going to expire before or at `expirationDate` timestamp
   */
  expirationDate?: number
  /**
   * Filter posts that has a parent post
   */
  includeParent?: boolean
}
