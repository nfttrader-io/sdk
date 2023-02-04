import Post from "./post"

type CreatePost = Pick<
  Post,
  "assets" | "expirationDate" | "messages" | "networkId" | "type"
> & { creatorAddress: string }

export default CreatePost
