import { PostInstance as Post } from "../../types/post"
/**
 * Represents the response object for a post request.
 */
export interface PostResponse {
  /**
   * @property {Post} post - the post attached with the response.
   */
  post: Post
}
