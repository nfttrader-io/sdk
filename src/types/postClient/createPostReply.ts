import Post from "./post"

type CreatePostReply = Pick<Post, "messages" | "assets" | "networkId"> & {
  creatorAddress: string
}

export default CreatePostReply
