import { PostAsset } from "../../../interfaces/post"

/**
 * Represents an item extracted from a PostAsset object, containing specific properties.
 */
type AssetItem = Pick<
  PostAsset,
  "address" | "networkId" | "type" | "tokenId" | "amount"
>

export { AssetItem }
