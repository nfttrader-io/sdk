import Maybe from "../general/maybe"
import PostResponse from "./postResponse"

export default interface ListPostsResponse {
  posts: Array<PostResponse>
  next: Maybe<string>
}
