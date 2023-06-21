import Maybe from "../general/maybe"
import Collector from "./collector"
import CreatePostAssets from "./createPostAssets"
import PostStatus from "./postStatus"
import PostStatusName from "./postStatusName"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

export default interface PostLike {
  id: string
  parentId: Maybe<string>
  status: PostStatus[PostStatusName]
  type: PostType[PostTypeName]
  creationDate: number
  networkId: string
  creator: Collector
  messages: Array<{ type: string }>
  assets: CreatePostAssets
  typeWanted: string
  typeOffered: string
  expirationDate: Maybe<number>
}
