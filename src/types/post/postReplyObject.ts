import ReplyPostAssets from "../../interfaces/post/replyPostAssets"

/**
 * Represents a post reply object with the following properties:
 */
type PostReplyObject = {
  /**
   * @property {string} creatorAddress - The address of the creator of the post reply.
   */
  creatorAddress: string
  /**
   * @property {Array<{ type: string }>} messages - An array of message objects with a type property.
   */
  messages: Array<{ type: string }>
  /**
   * @property {ReplyPostAssets} assets - The assets associated with the post reply.
   */
  assets: ReplyPostAssets
  /**
   * @property {string} networkId - The network ID of the post reply.
   */
  networkId: string
  /**
   * @property {string} parentId - The ID of the parent post that this reply is associated with.
   */
  parentId: string
}

export default PostReplyObject
