import Collector from "../../interfaces/post/collector"
import PostAssets from "../../interfaces/post/postAssets"
import PostStatus from "./postStatus"
import PostStatusName from "./postStatusName"
import PostType from "./postType"
import PostTypeName from "./postTypeName"

type PostInstance = {
  id: string
  parentId: string | null
  status: PostStatus[PostStatusName]
  type: PostType[PostTypeName]
  creationDate: number
  networkId: string
  creator: Collector
  messages: Array<{ type: string }>
  assets: PostAssets
  isCreator: boolean
  score?: number
  isDifferent?: boolean
  like?: number
  typeWanted?: string
  typeOffered?: string
  accepted?: boolean
  expirationDate?: number
  numberOffers?: number
  numberOffersRead?: number
  parent?: PostInstance | null
}

export default PostInstance
