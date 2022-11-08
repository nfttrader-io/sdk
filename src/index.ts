import TradeClient from "./tradeClient"
import AssetsArray from "./assetsArray"
import WebSocketProvider from "./webSocketProvider"
import _Asset from "./interfaces/assetsArray/asset"

declare namespace NFTTrader {
  type Asset = _Asset
  // TODO
}

export { TradeClient, AssetsArray, WebSocketProvider, NFTTrader }
