import Trade from "./trade"
import { Post } from "./core/post/index"
import { Builder as PostBuilder } from "./core/post/index"
import Oracle from "./oracle"
import Auth from "./auth"
import AssetsArray from "./core/assetsArray"
import _Network from "./types/general/network"
import POST_TYPE from "./constants/post/postType"
import POST_STATUS from "./constants/post/postStatus"

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
export * as CallbackParams from "./types/trade/callbackparams"
export * as CreateTradePeer from "./types/trade/tradeasset"
export * as WithAddress from "./types/trade/withaddress"
export * as TradeDetail from "./types/trade/tradedetail"
export * as DealMaster from "./types/trade/tradedetail"
export * as DealDetail from "./types/trade/tradedetail"
export * as Fee from "./types/trade/fee"
export * as TradeInstance from "./types/trade/tradeinstance"
export * as TradeParameters from "./types/trade/tradeparameters"
export * as TradeClientJsonRpcInit from "./types/trade/tradejsonrpcinit"
export * as TradeClientWeb3Init from "./types/trade/tradeweb3init"
export * as TradeClientConfig from "./types/trade/tradeconfig"
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
export * as AssetClientConfig from "./types/oracle/oracleConfig"
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
