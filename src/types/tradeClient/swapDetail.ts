import SwapParameters from "./swapParameters"

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
}

export type SwapDetail = {
  master: Array<DealMaster>
  detail: Array<DealDetail>
  parameters: {
    addressMaker: string
    addressTaker: string
    order: {
      orderHash: string
      parameters: SwapParameters
      signature: string
    }
  }
}
