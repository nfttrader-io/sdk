import { ethers } from "ethers"
import { TOKEN_CONSTANTS } from "../constants/base/tokenconstants"
import { Asset } from "../types/base"

/**
 * Represents an array of assets with methods to add different types of assets.
 */
export class AssetsArray {
  /**
   * Getter for the _assets property which returns a copy of the private __assets array.
   * @returns A copy of the __assets array.
   */
  private get _assets() {
    return [...this.__assets]
  }

  /**
   * Setter function for the _assets property. It sets the _assets property to a copy of the
   * provided array of assets.
   * @param {Array<Asset>} assets - An array of assets to set as the _assets property.
   * @returns None
   */
  private set _assets(assets: Array<Asset>) {
    this.__assets = [...assets]
  }

  /**
   * Private property that holds an array of Asset objects.
   * This property is initialized as an empty array.
   */
  private __assets!: Array<Asset>

  /**
   * Returns a copy of the TOKEN_CONSTANTS object.
   * @returns A copy of the TOKEN_CONSTANTS object.
   */
  public static get TOKEN_CONSTANTS() {
    return { ...TOKEN_CONSTANTS }
  }

  constructor(assets?: Array<Asset>) {
    this._assets = assets ?? []
  }

  /**
   * Adds an asset to the list of assets with an optional recipient.
   * @param {Asset} asset - The asset to be added.
   * @param {string} recipient - The recipient of the asset (optional).
   * @returns None
   */
  private _addAsset(asset: Asset, recipient?: string) {
    if (recipient) asset.recipient = recipient

    this.__assets.push(asset)
  }

  /**
   * Adds a native asset to the recipient with the specified amount.
   * @param {string} amount - The amount of the native asset to add.
   * @param {string} [recipient] - The recipient of the native asset. If not provided, the asset is added to the default recipient.
   * @throws {Error} If the amount is not a string or if the recipient is provided but is not a string.
   * @returns None
   */
  addNativeAsset(amount: string, recipient?: string) {
    if (typeof amount !== "string") throw new Error("amount must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        amount,
        itemType: AssetsArray.TOKEN_CONSTANTS.NATIVE,
        token: ethers.constants.AddressZero,
        identifier: "0",
      },
      recipient
    )
  }

  /**
   * Adds an ERC20 asset to the asset list with the specified address, amount, and recipient.
   * @param {string} address - The address of the ERC20 token.
   * @param {string} amount - The amount of the ERC20 token.
   * @param {string} [recipient] - The recipient address for the ERC20 token (optional).
   * @throws {Error} If address or amount is not specified, or if recipient is not a string.
   */
  addERC20Asset(address: string, amount: string, recipient?: string) {
    if (typeof address !== "string")
      throw new Error("address must be specified")
    if (typeof amount !== "string") throw new Error("amount must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        token: address,
        amount,
        itemType: AssetsArray.TOKEN_CONSTANTS.ERC20,
        identifier: "0",
      },
      recipient
    )
  }

  /**
   * Adds an ERC721 asset to the collection with the specified address and ID.
   * @param {string} address - The address of the ERC721 token.
   * @param {string} id - The ID of the ERC721 token.
   * @param {string} [recipient] - The recipient of the ERC721 token (optional).
   * @throws {Error} If address or id is not specified or if recipient is not a string.
   */
  addERC721Asset(address: string, id: string, recipient?: string) {
    if (typeof address !== "string")
      throw new Error("address must be specified")
    if (typeof id !== "string") throw new Error("id must be specified")
    if (recipient && typeof recipient !== "string")
      throw new Error("recipient must be a string")

    this._addAsset(
      {
        itemType: AssetsArray.TOKEN_CONSTANTS.ERC721,
        token: address,
        identifier: id,
      },
      recipient
    )
  }

  /**
   * Adds an ERC1155 asset to the collection.
   * @param {string} address - The address of the ERC1155 token.
   * @param {string} id - The ID of the ERC1155 token.
   * @param {string} amount - The amount of the ERC1155 token.
   * @param {string} [recipient] - The recipient of the ERC1155 token (optional).
   * @throws {Error} If address, id, or amount is not specified or if recipient is not a string.
   */
  addERC1155Asset(
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
        itemType: AssetsArray.TOKEN_CONSTANTS.ERC1155,
        token: address,
        identifier: id,
        amount,
      },
      recipient
    )
  }

  /**
   * Clears the assets array by setting it to an empty array.
   * @returns None
   */
  clearAssetsArray() {
    this.__assets = []
  }

  /**
   * Returns a string representation of the assets stored in this object.
   * @returns {string} A string representation of the assets.
   */
  toString() {
    return this.__assets.toString()
  }

  /**
   * Returns an array of assets.
   * @returns {Array} The array of assets.
   */
  toArray() {
    return this._assets
  }

  /**
   * Returns the assets of the object in JSON format.
   * @returns {Object} The assets of the object in JSON format.
   */
  toJSON() {
    return this._assets
  }

  /**
   * Returns an iterator object that contains the values for each asset in the assets array.
   * @returns {Iterator} An iterator object that can be used to iterate over the assets.
   */
  *[Symbol.iterator]() {
    for (const asset of this._assets) yield asset
  }
}
