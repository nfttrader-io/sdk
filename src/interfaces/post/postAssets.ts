import { PostAsset } from "./postasset"

/**
 * Represents a collection of post assets, including wanted and offered assets.
 * @interface PostAssets
 */
export interface PostAssets {
  /**
   * @property {PostAsset[]} wanted - An array of PostAsset objects representing wanted assets.
   */
  wanted?: PostAsset[]
  /**
   * @property {PostAsset[]} offered - An array of PostAsset objects representing offered assets.
   */
  offered?: PostAsset[]
}
