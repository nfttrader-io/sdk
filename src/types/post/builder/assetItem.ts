import PostAsset from "../../../interfaces/post/postAsset"

type AssetItem = Pick<
  PostAsset,
  "address" | "networkId" | "type" | "tokenId" | "amount"
>

export default AssetItem
