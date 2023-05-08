import PostAsset from "../postClient/postAsset"

type AssetItem = Pick<
  PostAsset,
  "address" | "imageUrl" | "networkId" | "type" | "tokenId" | "amount"
>

export default AssetItem
