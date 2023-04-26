import Maybe from "../general/maybe"
import Collector from "../postClient/collector"

export default interface TradeOrder {
  networkId: string
  swapId: string
  swapStatus: 0 | 1 | 2
  txHash: string
  addressMaker: string
  usernameMaker: Maybe<string>
  valueMaker: string
  addressTaker: string
  usernameTaker: Maybe<string>
  valueTaker: string
  name: string
  symbol: string
  imageUrl: string
  swapStart: string
  swapEnd: string
  type: "DIRECT_DEAL" | "PUBLIC_DEAL"
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
