import { PostItem } from "../../types/post"
/**
 * Represents the response object for a post request.
 */
export interface PostResponse {
  /**
   * @property {PostItem} post - the post attached with the response.
   */
  post: PostItem
}
