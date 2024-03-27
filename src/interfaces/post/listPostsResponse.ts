import Post from "../../types/post/postInstance"

export default interface ListPostsResponse {
  posts: Array<Post>
  total: number
}
