import TradeClient from "./tradeClient"
import PostClient from "./postClient"
import AssetClient from "./assetClient"
import AuthClient from "./authClient"
import AssetsArray from "./assetsArray"
import _Network from "./types/general/network"
import PostBuilder from "./postBuilder"
import POST_TYPE from "./lib/postClient/postType"
import POST_STATUS from "./lib/postClient/postStatus"

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
// TRADECLIENT
export * as CallbackParams from "./types/tradeClient/callbackParams"
export * as CreateTradePeer from "./types/tradeClient/createTradePeer"
export * as WithAddress from "./types/tradeClient/withAddress"
export * as TradeDetail from "./types/tradeClient/tradeDetail"
export * as DealMaster from "./types/tradeClient/tradeDetail"
export * as DealDetail from "./types/tradeClient/tradeDetail"
export * as Fee from "./types/tradeClient/fee"
export * as Trade from "./types/tradeClient/trade"
export * as TradeParameters from "./types/tradeClient/tradeParameters"
export * as TradeClientJsonRpcInit from "./types/tradeClient/tradeClientJsonRpcInit"
export * as TradeClientWeb3Init from "./types/tradeClient/tradeClientWeb3Init"
export * as TradeClientConfig from "./types/tradeClient/tradeClientConfig"
// POSTCLIENT
export * as PostClientConfig from "./types/postClient/postClientConfig"
export * as ListPostsFilters from "./types/postClient/listPostsFilters"
export * as ListPostsOrder from "./types/postClient/listPostsOrder"
export * as ListPostsRepliesOrder from "./types/postClient/listPostsRepliesOrder"
export * as ListPostsResponse from "./types/postClient/listPostsResponse"
// POSTBUILDER
export * as LookingFor from "./types/postBuilder/lookingFor"
export * as Offer from "./types/postBuilder/offer"
export * as AssetItem from "./types/postBuilder/assetItem"
// ASSETCLIENT
export * as AssetClientConfig from "./types/assetClient/assetClientConfig"
export * as CollectionSupported from "./types/assetClient/collectionSupported"
export * as CollectionsAdded from "./types/assetClient/collectionsAdded"
// AUTHCLIENT
export * as IsUserRegisteredResponse from "./types/authClient/isUserRegisteredResponse"
export * as SigninResponse from "./types/authClient/signinResponse"
export * as SignupResponse from "./types/authClient/signupResponse"
export * as Credentials from "./types/authClient/credentials"
export * as AuthConfig from "./types/authClient/authConfig"
export * as AuthClientConfig from "./types/authClient/authClientConfig"
export * as User from "./types/authClient/user"
export * as AuthMode from "./types/authClient/authMode"

export {
  TradeClient,
  PostClient,
  AssetsArray,
  PostBuilder,
  AssetClient,
  POST_TYPE,
  POST_STATUS,
  AuthClient,
}
export default {
  TradeClient,
  PostClient,
  AssetsArray,
  PostBuilder,
  AssetClient,
  POST_TYPE,
  POST_STATUS,
  AuthClient,
}
