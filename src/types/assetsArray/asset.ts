import AssetTypeName from "./assetTypeName"
import AssetTypeValue from "./assetTypeValue"

type Asset = {
  itemType: AssetTypeName | AssetTypeValue
} & Partial<{
  amount: string
  token: string
  identifier: string
  recipient: string
}>

export default Asset
