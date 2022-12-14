import Post from "./post"

type CreatePost = Pick<
  Post,
  "assets" | "expirationDate" | "messages" | "networkId" | "type"
> & { creator: string }

export default CreatePost
