import Post from "./post"

export default interface ListPostsResponse {
  posts: Array<Post>
  total: number
}
