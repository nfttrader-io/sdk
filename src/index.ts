import TradeClient from "./tradeClient"
import PostClient from "./postClient"
import AssetsArray from "./assetsArray"
import _Network from "./types/general/network"
import PostBuilder from "./postBuilder"

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

export { TradeClient, PostClient, AssetsArray, PostBuilder }
export default { TradeClient, PostClient, AssetsArray, PostBuilder }
