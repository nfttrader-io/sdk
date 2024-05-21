import { Asset } from "../base"
/**
 * Represents a trade asset with optional additional properties.
 * @returns {TradeAsset<Additional>} A trade asset object with optional additional properties.
 */
type TradeAsset<Additional extends Record<string, any> = {}> = {
  /**
   * @property {Array<Asset>} assets - An array of assets associated with the trade (NATIVE/ERC20/ERC721/ERC1155).
   */
  assets?: Array<Asset>
} & Additional

export { TradeAsset }
