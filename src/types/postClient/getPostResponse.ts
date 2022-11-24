import Maybe from "../general/maybe"
import Post from "./post"

export default interface GetPostResponse {
  post: Maybe<Post>
}
