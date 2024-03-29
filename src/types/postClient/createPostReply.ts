import CreatePostAssets from "./createPostAssets"

type CreatePostReply = {
  creatorAddress: string
  messages: Array<{ type: string }>
  assets: CreatePostAssets
  networkId: string
  parentId: string
}

export default CreatePostReply
