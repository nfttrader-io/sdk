import { PostTypeName } from "./posttypename"
import { PostTypeValue } from "./posttypevalue"

/**
 * Represents a PostType object that maps PostTypeName to PostTypeValue.
 */
type PostType = Record<PostTypeName, PostTypeValue>

export { PostType }
