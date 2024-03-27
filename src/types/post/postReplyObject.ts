import ReplyPostAssets from "../../interfaces/post/replyPostAssets"

type PostReplyObject = {
  creatorAddress: string
  messages: Array<{ type: string }>
  assets: ReplyPostAssets
  networkId: string
  parentId: string
}

export default PostReplyObject
