import TradeClient from "./tradeClient"
import PostClient from "./postClient"
import AssetsArray from "./assetsArray"
import WebSocketProvider from "./webSocketProvider"

// TYPES export
// GENERAL
export * as Bitmap from "./types/general/bitmap"
export * as Network from "./types/general/network"
// ASSETSARRAY
export * as Asset from "./types/assetsArray/asset"
export * as AssetType from "./types/assetsArray/assetType"
export * as AssetTypeName from "./types/assetsArray/assetTypeName"
export * as AssetTypeValue from "./types/assetsArray/assetTypeValue"
// TRADECLIENT
export * as CallbackParams from "./types/tradeClient/callbackParams"
export * as CreateSwapPeer from "./types/tradeClient/createSwapPeer"
export * as Swap from "./types/tradeClient/swap"
export * as SwapParameters from "./types/tradeClient/swapParameters"
export * as TradeClientJsonRpcInit from "./types/tradeClient/tradeClientJsonRpcInit"
export * as TradeClientWeb3Init from "./types/tradeClient/tradeClientWeb3Init"

export { TradeClient, PostClient, AssetsArray, WebSocketProvider }
export default { TradeClient, PostClient, AssetsArray, WebSocketProvider }
