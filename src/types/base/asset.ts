import { AssetTypeName } from "./assettypename"
import { AssetTypeValue } from "./assettypevalue"

/**
 * Represents an asset with specific properties.
 */
type Asset = {
  itemType: AssetTypeName | AssetTypeValue
} & Partial<{
  amount: string
  token: string
  identifier: string
  recipient: string
}>

export { Asset }
