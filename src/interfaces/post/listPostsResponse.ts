import { PostInstance as Post } from "../../types/post"
/**
 * Represents the response object when listing posts.
 * @interface ListPostsResponse
 */
export interface ListPostsResponse {
  /**
   * @property {Array<Post>} posts - An array of Post instances.
   */
  posts: Array<Post>
  /**
   * @property {number} total - The total number of posts.
   */
  total: number
}
