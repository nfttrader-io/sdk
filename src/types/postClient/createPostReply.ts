import Post from "./post"

type CreatePostReply = Pick<Post, "messages" | "assets"> & {
  creatorAddress: string
}

export default CreatePostReply
