import Maybe from "../general/maybe"
import { Collectible } from "./collectible"

export default interface GetNFTsResponse {
  response: string
  nfts: Array<Collectible>
  continuation: Maybe<string> | undefined
  total: number
}
