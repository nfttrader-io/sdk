import PostAsset from "../postClient/postAsset"

type AssetItem = Pick<
  PostAsset,
  "address" | "networkId" | "type" | "tokenId" | "amount"
>

export default AssetItem
