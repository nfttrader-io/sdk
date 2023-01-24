import Collector from "./collector"
import PostAssets from "./postAssets"
import PostStatus from "./postStatus"
import PostStatusName from "./postStatusName"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

export default interface Post {
  id: string
  parentId: string | null
  status: PostStatus[PostStatusName]
  type: PostType[PostTypeName]
  creationDate: number
  networkId: string
  creator: Collector
  messages: Array<{ type: string }>
  assets: PostAssets
  score?: number
  isDifferent?: boolean
  like?: number
  assetsChecked?: boolean
  typeWanted?: string
  typeOffered?: string
  accepted?: boolean
  expirationDate?: number
  numberOffers?: number
  numberOffersRead?: number
}
