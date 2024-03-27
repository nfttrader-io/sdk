import CreatePostAssets from "../../interfaces/post/createPostAssets"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

type CreatePost = {
  assets: CreatePostAssets
  expirationDate: number
  messages: Array<{ type: string }>
  networkId: string
  type: PostType[PostTypeName]
  creatorAddress: string
}

export default CreatePost
