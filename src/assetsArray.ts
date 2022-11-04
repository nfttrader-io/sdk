import Asset from "../interfaces/assetsArray/asset"

/**
 * This class represents an array of assets.
 */
export default class AssetsArray {
  private assetsArray: Array<Asset> = []
  private static readonly TOKEN_COSTANTS = {
    ERC20: 0,
    ERC721: 1,
    ERC1155: 2,
  }

  /**
   * Add an ERC20 token item to the assets Array.
   *
   * @param address - The ERC20 token address.
   * @param tokenAmount - The amount of the token used.
   */
  public addERC20Asset(address: string, tokenAmount: string | number) {
    if (isNaN(Number(tokenAmount)))
      throw new Error("tokenAmount must be a numeric value.")
    this.assetsArray.push([
      address,
      AssetsArray.TOKEN_COSTANTS.ERC20,
      [],
      [tokenAmount],
      [0],
      [],
    ])
  }

  /**
   * Add an ERC721 token item to the assets Array.
   *
   * @param address - The ERC721 token address.
   * @param tokenId - The id of the ERC721 token used.
   */
  public addERC721Asset(address: string, tokenId: string) {
    if (typeof tokenId !== "string")
      throw new Error("tokenId must be a string.")

    this.assetsArray.push([
      address,
      AssetsArray.TOKEN_COSTANTS.ERC721,
      [tokenId],
      [],
      [],
      [],
    ])
  }

  /**
   * Add an ERC1155 token item to the assets Array.
   *
   * @param address - The ERC1155 token address.
   * @param tokenIds - The ids of the ERC1155 token used.
   * @param tokenAmounts - The amounts of the ERC1155 token used.
   */
  public addERC1155Asset(
    address: string,
    tokenIds: Array<string>,
    tokenAmounts: Array<string | number>
  ) {
    if (
      !tokenIds.length ||
      !tokenAmounts.length ||
      tokenIds.length !== tokenAmounts.length
    )
      throw new Error(
        "tokenIds and tokenAmounts must have at least one element and both must have the same size."
      )

    this.assetsArray.push([
      address,
      AssetsArray.TOKEN_COSTANTS.ERC1155,
      tokenIds,
      tokenAmounts,
      [],
      [],
    ])
  }

  /**
   * Clear the assets Array.
   */
  public clearAssetsArray() {
    this.assetsArray = []
  }

  /**
   * Returns the assets Array.
   */
  public getAssetsArray() {
    return [...this.assetsArray]
  }
}
