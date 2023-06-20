import Maybe from "../general/maybe"
import Collection from "./collection"

export default interface PostAsset {
  name: string
  statusVerification: 0 | 1 | 2
  address: string
  imageUrl: string
  networkId: string
  abi: Maybe<Array<any>>
  type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
  isNft: boolean
  symbol: string
  createdAt: Maybe<string>
  tokenId: Maybe<string>
  amount: Maybe<string>
  amountHumanReadable: Maybe<string>
  isDifferent: boolean
  collection?: Collection
}
