/**
 * Represents an AssetType object that maps AssetTypeName to AssetTypeValue.
 */
import { AssetTypeName } from "./assettypename"
import { AssetTypeValue } from "./assettypevalue"

type AssetType = Record<AssetTypeName, AssetTypeValue>

export { AssetType }
