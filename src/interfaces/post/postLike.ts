import Maybe from "../../types/general/maybe"
import Collector from "./collector"
import CreatePostAssets from "./replyPostAssets"
import PostStatus from "../../types/post/postStatus"
import PostStatusName from "../../types/post/postStatusName"
import PostType from "../../types/post/postType"
import PostTypeName from "../../types/post/postTypeName"

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
