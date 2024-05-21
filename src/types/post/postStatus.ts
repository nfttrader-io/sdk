import { PostStatusName } from "./poststatusname"
import { PostStatusValue } from "./poststatusvalue"
/**
 * Represents a PostStatus object that consists of a mapping between PostStatusName and PostStatusValue.
 */
type PostStatus = Record<PostStatusName, PostStatusValue>

export { PostStatus }
