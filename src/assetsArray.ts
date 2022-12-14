import TOKEN_CONSTANTS from "./lib/assetsArray/tokenConstants"
import Asset from "./types/assetsArray/asset"

/**
 * This class represents an array of assets.
 */
export default class AssetsArray {
  private get _assets() {
    return [...this.__assets]
  }
  private set _assets(assets: Array<Asset>) {
    this.__assets = [...assets]
  }
  private __assets!: Array<Asset>
  public static get TOKEN_COSTANTS() {
    return { ...TOKEN_CONSTANTS }
  }

  constructor(assets?: Array<Asset>) {
    this._assets = assets ?? []
  }

  private _addAsset(asset: Asset, recipient?: string) {
    if (recipient) asset.recipient = recipient

    this.__assets.push(asset)
  }

  /**
   * Add a native token to the assets Array.
   *
   * @param amount - The amount of the token used.
   * @param recipient - The taker address of this asset
   */
  public addNativeAsset(amount: string, recipient?: string) {
    if (typeof amount !== "string") throw new Error("amount must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        itemType: AssetsArray.TOKEN_COSTANTS.NATIVE,
        amount,
      },
      recipient
    )
  }

  /**
   * Add an ERC20 token item to the assets Array.
   *
   * @param address - The ERC20 token address.
   * @param amount - The amount of the token used.
   * @param recipient - The taker address of this asset
   */
  public addERC20Asset(address: string, amount: string, recipient?: string) {
    if (typeof address !== "string")
      throw new Error("address must be specified")
    if (typeof amount !== "string") throw new Error("amount must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        itemType: AssetsArray.TOKEN_COSTANTS.ERC20,
        token: address,
        amount,
      },
      recipient
    )
  }

  /**
   * Add an ERC721 token item to the assets Array.
   *
   * @param address - The ERC721 token address.
   * @param id - The id of the ERC721 token used.
   */
  public addERC721Asset(address: string, id: string, recipient?: string) {
    if (typeof address !== "string")
      throw new Error("address must be specified")
    if (typeof id !== "string") throw new Error("id must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        itemType: AssetsArray.TOKEN_COSTANTS.ERC721,
        token: address,
        identifier: id,
      },
      recipient
    )
  }

  /**
   * Add an ERC1155 token item to the assets Array.
   *
   * @param address - The ERC1155 token address.
   * @param id - The id of the ERC1155 token used.
   * @param amount - The amount of the ERC1155 token used.
   */
  public addERC1155Asset(
    address: string,
    id: string,
    amount: string,
    recipient?: string
  ) {
    if (typeof address !== "string")
      throw new Error("address must be specified")
    if (typeof id !== "string") throw new Error("id must be specified")
    if (typeof amount !== "string") throw new Error("amount must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        itemType: AssetsArray.TOKEN_COSTANTS.ERC1155,
        token: address,
        identifier: id,
        amount,
      },
      recipient
    )
  }

  /**
   * Clear the assets Array.
   */
  public clearAssetsArray() {
    this.__assets = []
  }

  public toString() {
    return this.__assets.toString()
  }

  public toArray() {
    return this._assets
  }

  public toJSON() {
    return this._assets
  }

  *[Symbol.iterator]() {
    for (const asset of this._assets) yield asset
  }
}
