import AssetTypeName from "../types/assetsArray/assetTypeName"
import AssetTypeValue from "../types/assetsArray/assetTypeValue"

const TOKEN_CONSTANTS: Record<AssetTypeName, AssetTypeValue> = {
  NATIVE: 0,
  ERC20: 1,
  ERC721: 2,
  ERC1155: 3,
}

export default TOKEN_CONSTANTS
