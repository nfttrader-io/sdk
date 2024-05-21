import { Maybe } from "../../types/base"
import { Collector } from "./collector"
import { ReplyPostAssets } from "./replypostassets"
import { PostStatus } from "../../types/post/poststatus"
import { PostStatusName } from "../../types/post/poststatusname"
import { PostType } from "../../types/post/posttype"
import { PostTypeName } from "../../types/post/posttypename"

/**
 * Represents a post like object with various properties.
 * @interface PostLike
 */
export interface PostLike {
  /**
   * @property {string} id - The unique identifier of the post like.
   */
  id: string
  /**
   * @property {Maybe<string>} parentId - The optional parent ID of the post like.
   */
  parentId: Maybe<string>
  /**
   * @property {PostStatus[PostStatusName]} status - The status of the post like.
   */
  status: PostStatus[PostStatusName]
  /**
   * @property {PostType[PostTypeName]} type - The type of the post like.
   */
  type: PostType[PostTypeName]
  /**
   * @property {number} creationDate - The timestamp of when the post like was created.
   */
  creationDate: number
  /**
   * @property {string} networkId - The network ID associated with the post like.
   */
  networkId: string
  /**
   * @property {Collector} creator - The creator of the post like.
   */
  creator: Collector
  /**
   * @property {Array<{type: string}>} messages -
   */
  messages: Array<{ type: string }>
  /**
   * @property {ReplyPostAssets} assets - The assets attached to the reply post.
   */
  assets: ReplyPostAssets
  /**
   * @property {string} typeWanted - The type of item the poster is looking for.
   */
  typeWanted: string
  /**
   * @property {string} typeOffered - The type of item the poster is offering.
   */
  typeOffered: string
  /**
   * @property {Maybe<number>} expirationDate - The expiration date of the reply post, if specified.
   */
  expirationDate: Maybe<number>
}
