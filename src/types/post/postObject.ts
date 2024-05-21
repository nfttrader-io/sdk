import CreatePostAssets from "../../interfaces/post/replyPostAssets"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

/**
 * Represents a post object with the following properties:
 */
type PostObject = {
  /**
   * @property {CreatePostAssets} assets - The assets associated with the post.
   */
  assets: CreatePostAssets
  /**
   * @property {number} expirationDate - The expiration date of the post.
   */
  expirationDate: number
  /**
   * @property {Array<{ type: string }>} messages - An array of message types associated with the post.
   */
  messages: Array<{ type: string }>
  /**
   * @property {string} networkId - The network ID of the post.
   */
  networkId: string
  /**
   * @property {PostType[PostTypeName]} type - The type of the post based on PostType and PostTypeName.
   */
  type: PostType[PostTypeName]
  /**
   * @property {string} creatorAddress - The address of the creator of the post.
   */
  creatorAddress: string
}

export default PostObject
