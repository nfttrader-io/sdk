import Post from "./post"

type CreatePostReply = Pick<Post, "messages" | "assets"> & { creator: string }

export default CreatePostReply
