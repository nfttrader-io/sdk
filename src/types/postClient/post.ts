import Collector from "./collector"
import PostAssets from "./postAssets"
import PostStatus from "./postStatus"
import PostStatusName from "./postStatusName"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

export default interface Post {
  id: string
  parentId: string
  score: number
  isDifferent: boolean
  like: number
  assetsChecked: boolean
  status: PostStatus[PostStatusName]
  type: PostType[PostTypeName]
  typeWanted: string
  typeOffered: string
  accepted: boolean
  creationDate: number
  networkId: string
  expirationDate: number
  numberOffers: number
  creator: Collector
  messages: Array<{ type: string }>
  assets: PostAssets
  disabled: boolean
}
