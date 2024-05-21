import { AssetItem } from "../../types/post/builder"
/**
 * Represents the assets associated with a reply post, including wanted and offered items.
 */
export interface ReplyPostAssets {
  /**
   * @property {AssetItem[]} [wanted] - the wanted assets.
   */
  wanted?: AssetItem[]
  /**
   * @property {AssetItem[]} [offered] - the offered assets.
   */
  offered?: AssetItem[]
}
