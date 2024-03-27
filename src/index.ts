import Trade from "./trade"
import Post from "./post"
import Oracle from "./oracle"
import Auth from "./auth"
import AssetsArray from "./assetsArray"
import _Network from "./types/general/network"
import PostBuilder from "./postBuilder"
import POST_TYPE from "./lib/post/postType"
import POST_STATUS from "./lib/post/postStatus"

// TYPES export
// GENERAL
export * as BitmapOffered from "./types/general/bitmapOffered"
export * as BitmapWanted from "./types/general/bitmapWanted"
export type Network = _Network
// ASSETSARRAY
export * as Asset from "./types/assetsArray/asset"
export * as AssetType from "./types/assetsArray/assetType"
export * as AssetTypeName from "./types/assetsArray/assetTypeName"
export * as AssetTypeValue from "./types/assetsArray/assetTypeValue"
// TRADE
export * as CallbackParams from "./types/trade/callbackParams"
export * as CreateTradePeer from "./types/trade/createTradePeer"
export * as WithAddress from "./types/trade/withAddress"
export * as TradeDetail from "./types/trade/tradeDetail"
export * as DealMaster from "./types/trade/tradeDetail"
export * as DealDetail from "./types/trade/tradeDetail"
export * as Fee from "./types/trade/fee"
export * as TradeInstance from "./types/trade/tradeInstance"
export * as TradeParameters from "./types/trade/tradeParameters"
export * as TradeClientJsonRpcInit from "./types/trade/tradeClientJsonRpcInit"
export * as TradeClientWeb3Init from "./types/trade/tradeClientWeb3Init"
export * as TradeClientConfig from "./types/trade/tradeClientConfig"
// POST
export * as PostClientConfig from "./types/post/postClientConfig"
export * as ListPostsFilters from "./interfaces/post/listPostsFilters"
export * as ListPostsOrder from "./interfaces/post/listPostsOrder"
export * as ListPostsRepliesOrder from "./interfaces/post/listPostsRepliesOrder"
export * as ListPostsResponse from "./interfaces/post/listPostsResponse"
// POSTBUILDER
export * as LookingFor from "./types/post/builder/lookingFor"
export * as Offer from "./types/post/builder/offer"
export * as AssetItem from "./types/post/builder/assetItem"
// ORACLE
export * as AssetClientConfig from "./types/oracle/assetClientConfig"
export * as CollectionSupported from "./interfaces/oracle/collectionSupported"
export * as CollectionsAdded from "./interfaces/oracle/collectionsAdded"
// AUTH
export * as IsUserRegisteredResponse from "./types/auth/isUserRegisteredResponse"
export * as SigninResponse from "./types/auth/signinResponse"
export * as SignupResponse from "./types/auth/signupResponse"
export * as Credentials from "./types/auth/credentials"
export * as AuthConfig from "./types/auth/authConfig"
export * as AuthClientConfig from "./types/auth/authClientConfig"
export * as User from "./types/auth/user"
export * as AuthMode from "./types/auth/authMode"

export {
  Trade,
  Post,
  AssetsArray,
  PostBuilder,
  Oracle,
  POST_TYPE,
  POST_STATUS,
  Auth,
}
export default {
  Trade,
  Post,
  AssetsArray,
  PostBuilder,
  Oracle,
  POST_TYPE,
  POST_STATUS,
  Auth,
}
