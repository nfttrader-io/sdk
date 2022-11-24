import Maybe from "../general/maybe"
import Post from "./post"

export default interface ListPostsResponse {
  // TODO
  posts: Array<Post>
  next: Maybe<string>
}
