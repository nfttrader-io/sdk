import Maybe from "../../types/general/maybe"

export default interface Collection {
  name: string
  statusVerification: -1 | 0 | 1 | 2
  address: string
  imageUrl: Maybe<string>
  networkId: string
  abi: Maybe<Array<any>>
  type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
  symbol: Maybe<string>
  createdAt: Maybe<string>
  isFavourite?: 0 | 1
  notification?: boolean
}
