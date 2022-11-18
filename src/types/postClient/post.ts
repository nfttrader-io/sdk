import POST_STATUS from "../../enums/postClient/postStatus"
import POST_TYPE from "../../enums/postClient/postType"
import Collector from "./collector"
import PostAssets from "./postAssets"

export default interface Post {
  id: string
  isOwner: boolean
  parentId: string
  score: number
  like: number
  assetsChecked: boolean
  status: POST_STATUS
  type: POST_TYPE
  typeWanted: string
  typeOffered: string
  accepted: boolean
  createdAt: string
  networkId: string
  expirationDate: string
  numberOffers: number
  creator: Collector
  messages: Array<{ type: string }>
  assets: PostAssets
  spicyest: {
    amountCurrency: string
  }
}
