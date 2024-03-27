import CreatePostAssets from "../../interfaces/post/replyPostAssets"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

type PostObject = {
  assets: CreatePostAssets
  expirationDate: number
  messages: Array<{ type: string }>
  networkId: string
  type: PostType[PostTypeName]
  creatorAddress: string
}

export default PostObject
