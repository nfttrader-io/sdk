import Asset from "../assetsArray/asset"

type CreateSwapPeer<Additional extends Record<string, any> = {}> = {
  /**
   * The assets (NATIVE/ERC20/ERC721/ERC1155) provided.
   *
   * @defaultValue []
   */
  assets?: Array<Asset>
} & Additional

export default CreateSwapPeer
