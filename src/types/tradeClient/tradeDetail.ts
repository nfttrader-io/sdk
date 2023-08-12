import Collector from "../postClient/collector"
import TradeParameters from "./tradeParameters"

export type DealDetail = {
  blc: string | null
  blcNative: number
  blcPercentage: string
  blcPercentageNative: number
  collectionAddress: string
  collectionLogo: string
  creator: 0 | 1
  networkId: string
  imageUrl: string
  isImg: 0 | 1
  name: string | null
  statusVerification: 0 | 1 | 2
  swapId: string
  symbol: string
  tokenId: string | null
  tokenUSDValue: number
  type: "ERC721" | "ERC20" | "ERC1155" | "NATIVE"
}

export type DealMaster = {
  imageUrl: string
  name: string
  symbol: string
  valueMaker: string
  valueTaker: string
  flatFeeMaker: string
  flatFeeMakerNative: number
  flatFeeTaker: string
  flatFeeTakerNative: number
  percentageFeeMaker: string
  percentageFeeMakerNative: number
  percentageFeeTaker: string
  percentageFeeTakerNative: number
  swapStatus: number
  swapEnd: number
  txHash: string
  maker: Array<Collector>
  taker: Array<Collector>
  collections: Array<{
    creator: 0 | 1
    networkId: string
    collectionAddress: string
    abi: Array<any>
    name: string
    symbol: string
    assetLogo: string
    type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
    statusVerification: 0 | 1 | 2
  }>
}

export type TradeDetail = {
  master: Array<DealMaster>
  detail: Array<DealDetail>
  parameters: {
    addressMaker: string
    addressTaker: string
    order: {
      orderHash: string
      parameters: TradeParameters
      signature: string
    }
  }
}
