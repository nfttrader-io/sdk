import Maybe from "../general/maybe"
import Collector from "../postClient/collector"

export default interface Trade {
  networkId: string
  swapId: number
  swapStatus: number
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
    creator: number
    networkId: Maybe<string>
    collectionAddress: Maybe<string>
    abi: Maybe<Array<any>>
    name: Maybe<string>
    symbol: Maybe<string>
    assetLogo: Maybe<string>
    type: Maybe<string>
    statusVerification: number
  }>
}
