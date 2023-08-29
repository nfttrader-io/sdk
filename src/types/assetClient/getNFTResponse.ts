import { Collectible } from "./collectible"

export default interface GetNFTResponse {
  data: Array<{ nft: Collectible }>
}
