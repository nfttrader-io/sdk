import Maybe from "../general/maybe"

export default interface Collection {
  name: string
  statusVerification: 0 | 1 | 2
  address: string
  imageUrl: string
  networkId: string
  abi: Array<any>
  type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
  symbol: string
  createdAt: Maybe<string>
  isFavourite?: 0 | 1
}
