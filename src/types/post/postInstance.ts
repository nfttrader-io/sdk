import { Collector, PostAssets } from "../../interfaces/post"
import Maybe from "../general/maybe"
import { PostStatus } from "./poststatus"
import { PostStatusName } from "./poststatusname"
import { PostType } from "./posttype"
import { PostTypeName } from "./posttypename"

/**
 * Represents a post instance with various properties.
 */
type PostInstance = {
  /**
   * @property {string} id - The unique identifier of the post.
   */
  id: string
  /**
   * @property {Maybe<string>} parentId - The identifier of the parent post, if any.
   */
  parentId: Maybe<string>
  /**
   * @property {PostStatus[PostStatusName]} status - The status of the post.
   */
  status: PostStatus[PostStatusName]
  /**
   * @property {PostType[PostTypeName]} type - The type of the post.
   */
  type: PostType[PostTypeName]
  /**
   * @property {number} creationDate - The timestamp of when the post was created.
   */
  creationDate: number
  /**
   * @property {string} networkId - The network identifier of the post.
   */
  networkId: string
  /**
   * @property {Collector} creator - The creator of the post.
   */
  creator: Collector
  /**
   * @property {Array<{ type: string }>} messages -
   */
  messages: Array<{ type: string }>
  /**
   * @property {PostAssets} assets - The assets associated with the post.
   */
  assets: PostAssets
  /**
   * @property {boolean} isCreator - Indicates if the user is the creator of the post.
   */
  isCreator: boolean
  /**
   * @property {number} [score] - The score of the post.
   */
  score?: number
  /**
   * @property {boolean} [isDifferent] - Indicates if the post is different from others.
   */
  isDifferent?: boolean
  /**
   * @property {number} [like] - The number of likes on the post.
   */
  like?: number
  /**
   * @property {string} [typeWanted] - The type of item wanted in the post.
   */
  typeWanted?: string
  /**
   * @property {string} [typeOffered] - The type of item offered in the post.
   */
  typeOffered?: string
  /**
   * @property {boolean} [accepted] - Indicates if the post is accepted.
   */
  accepted?: boolean
  /**
   * @property {number} [expirationDate] - The expiration date of the post.
   */
  expirationDate?: number
  /**
   * @property {number} [numberOffers] - The number of offers for the post.
   */
  numberOffers?: number
  /**
   * @property {number} [numberOffersRead] - The number of offers read for the post.
   */
  numberOffersRead?: number
  /**
   * @property {Maybe<PostInstance>} [parent] - The parent post instance, if any.
   */
  parent?: Maybe<PostInstance>
}

export { PostInstance }
