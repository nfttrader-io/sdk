import Post from "./post"

export default interface PostResponse {
  post: Post
  isOwner: boolean
}
