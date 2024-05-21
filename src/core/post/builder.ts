import { POST_STATUS } from "../../constants/post/poststatus"
import { POST_TYPE } from "../../constants/post/posttype"
import { Maybe } from "../../types/base"
import { AssetItem } from "../../types/post/builder/assetitem"
import { Offer, LookingFor } from "../../enums/post"
import { ReplyPostAssets, PostLike } from "../../interfaces/post"
import { PostReplyObject, PostTypeValue, PostObject } from "../../types/post/"
import { ethers } from "ethers"

/**
 * Represents a Builder class that helps in creating and managing post objects.
 * @class Builder
 */
export class Builder {
  /**
   * @property {string} postId - The unique identifier of the post.
   */
  private postId: string = ""
  /**
   * @property {string} parentId - The identifier of the parent post, if any.
   */
  private parentId: string = ""
  /**
   * @property {Maybe<PostTypeValue>} type - The type of the post.
   */
  private type: Maybe<PostTypeValue> = null
  /**
   * @property {Date} creationDate - The date when the post was created.
   */
  private creationDate: Date = new Date()
  /**
   * @property {string} networkId - The network identifier associated with the post.
   */
  private networkId: string = ""
  /**
   * @property {Maybe<Date>} expirationDate - The date when the post expires, if applicable.
   */
  private expirationDate: Maybe<Date> = null
  /**
   * @property {Maybe<string>} creatorAddress - The address of the creator of the post.
   */
  private creatorAddress: Maybe<string> = null
  /**
   * @property {Maybe<Array<{ type: string }>>} messages - Array of message objects with a 'type' property.
   */
  private messages: Maybe<Array<{ type: string }>> = null
  /**
   * @property {Maybe<ReplyPostAssets>} assets - Object containing reply post assets.
   */
  private assets: Maybe<ReplyPostAssets> = {}
  /**
   * @property {AssetItem[]} wanted - Array of wanted items.
   */
  private wanted: AssetItem[] = []
  /**
   * @property {AssetItem[]} offered - Array of offered items.
   */
  private offered: AssetItem[] = []
  /**
   * @property {Array<string>} typeWanted - Array of strings representing types of wanted items.
   */
  private typeWanted: Array<string> = ["0", "0", "0"]
  /**
   * @property {Array<string>} typeOffered - Array of strings representing types of offered items.
   */
  private typeOffered: Array<string> = ["0", "0", "0"]

  /**
   * Constructor for a class instance with optional network ID and creator address parameters.
   * @param {string} [networkId] - The network ID associated with the instance.
   * @param {string} [creatorAddress] - The creator address associated with the instance.
   * @returns None
   */
  constructor(networkId?: string, creatorAddress?: string) {
    if (networkId) this.networkId = networkId
    if (creatorAddress) this.creatorAddress = creatorAddress
  }

  /**
   * Validates the properties of the object instance to ensure that all required fields are set based on the post type.
   * Throws an error if any required field is missing or invalid.
   * @throws {Error} Assets must be set if not already set.
   * @throws {Error} Post type must be set. Call setPostType() method before if type is not a number.
   * @throws {Error} Expiration date must be set. Call setPostDuration() method before if expiration date is not set and type is not POST_TYPE.R1.
   * @throws {Error} Creator address must be set. Call setPostCreator() method before if creator address is not set.
   * @throws {Error} Wanted assets cannot be empty if
   */
  private _validation() {
    if (!this.assets) throw new Error("Assets must be setted.")
    if (typeof this.type != "number")
      throw new Error(
        "Post type must be setted. Call setPostType() method before."
      )
    if (!this.expirationDate && this.type !== POST_TYPE.R1)
      throw new Error(
        "Expiration date must be setted. Call setPostDuration() method before."
      )
    if (!this.creatorAddress)
      throw new Error(
        "Creator address must be setted. Call setPostCreator() method before."
      )

    if (this.type === POST_TYPE.A1 || this.type === POST_TYPE.B1) {
      if (!this.assets!.wanted || this.assets!.wanted.length === 0)
        throw new Error(
          `wanted assets can not be empty if the post type is [${
            this.type === POST_TYPE.A1 ? `A1` : `B1`
          }]`
        )
      else if (!this.assets!.offered || this.assets!.offered.length === 0)
        throw new Error(
          `offered assets can not be empty if the post type is [${
            this.type === POST_TYPE.A1 ? `A1` : `B1`
          }]`
        )
    } else if (this.type === POST_TYPE.A2 || this.type === POST_TYPE.B2) {
      if (!this.assets!.wanted || this.assets!.wanted.length === 0)
        throw new Error(
          `wanted assets can not be empty if the post type is [${
            this.type === POST_TYPE.A2 ? `A2` : `B2`
          }]`
        )
      else if (this.assets!.offered && this.assets!.offered.length > 0)
        throw new Error(
          `offered assets can not be filled if the post type is [${
            this.type === POST_TYPE.A2 ? `A2` : `B2`
          }]`
        )
    } else if (this.type === POST_TYPE.C1) {
      if (this.assets!.wanted && this.assets!.wanted.length > 0)
        throw new Error(
          `wanted assets can not be filled if the post type is [C1]`
        )
      else if (!this.assets!.offered || this.assets!.offered.length === 0)
        throw new Error(
          `offered assets can not be empty if the post type is [C1]`
        )
    } else if (this.type === POST_TYPE.R1) {
      if (!this.assets!.wanted || this.assets!.wanted.length === 0)
        throw new Error(
          `wanted assets can not be empty if the post type is [R1]`
        )
      else if (!this.assets!.offered || this.assets!.offered.length === 0)
        throw new Error(
          `offered assets can not be empty if the post type is [R1]`
        )
    }

    if (!this.messages)
      throw new Error(
        "Message must be setted. Call setMessageIntro() method before."
      )
  }

  /**
   * Calculates the number of NFTs and tokens wanted based on the 'wanted' array.
   * Updates the 'typeWanted' array with the count of tokens and NFTs.
   * @returns None
   */
  private _calculateTypeWanted() {
    let countNFT = 0
    let countToken = 0

    for (let w of this.wanted) {
      ;(w.type === "ERC1155" || w.type === "ERC721") && countNFT++
      ;(w.type === "ERC20" || w.type === "NATIVE") && countToken++
    }

    this.typeWanted[1] = countToken === 0 ? "0" : countToken === 1 ? "1" : "2"
    this.typeWanted[2] = countNFT === 0 ? "0" : countNFT === 1 ? "1" : "2"
  }

  /**
   * Calculates the number of different types of offers in the 'offered' array and
   * updates the 'typeOffered' array accordingly.
   * @returns None
   */
  private _calculateTypeOffered() {
    let countNFT = 0
    let countToken = 0

    for (let o of this.offered) {
      ;(o.type === "ERC1155" || o.type === "ERC721") && countNFT++
      ;(o.type === "ERC20" || o.type === "NATIVE") && countToken++
    }

    this.typeOffered[1] = countToken === 0 ? "0" : countToken === 1 ? "1" : "2"
    this.typeOffered[2] = countNFT === 0 ? "0" : countNFT === 1 ? "1" : "2"
  }

  /**
   * Concatenates the elements of typeWanted and typeOffered arrays with an underscore in between.
   * @returns A string that combines elements of typeWanted and typeOffered arrays with an underscore.
   */
  private _getMessage() {
    return `${this.typeWanted.join("")}_${this.typeOffered.join("")}`
  }

  /**
   * Resets the properties of an object to their default values.
   * @returns None
   */
  private _reset() {
    this.postId = ""
    this.parentId = ""
    this.type = null
    this.creationDate = new Date()
    this.networkId = ""
    this.expirationDate = null
    this.creatorAddress = null
    this.messages = null
    this.assets = null
  }

  /**
   * Set the network ID for the current instance.
   * @param {string} networkId - The network ID to set.
   * @returns None
   */
  setNetworkId(networkId: string) {
    this.networkId = networkId
  }

  /**
   * Sets the intro message based on the provided intro code.
   * @param {string} introCode - The code representing the intro message to set. Possible values: "0" to "11".
   * @returns None
   */
  setIntroMessage(
    introCode:
      | "0"
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
      | "11"
  ) {
    this.messages = [
      {
        type: introCode,
      },
    ]
  }

  /**
   * Set the address of the post creator.
   * @param {string} address - The address of the post creator.
   * @returns None
   */
  setPostCreator(address: string) {
    this.creatorAddress = address
  }

  /**
   * Adds the provided asset to the list of wanted assets based on certain conditions.
   * @param {AssetItem} asset - The asset item to be added to the list of wanted assets.
   * @throws {Error} If adding the asset violates certain conditions.
   * @returns None
   */
  addWantedAsset(asset: AssetItem) {
    if (this.type !== POST_TYPE.R1) {
      //in collection format
      let exists: boolean = false
      if (asset.type === "ERC20" || asset.type === "NATIVE") {
        //no more than one ERC20 can be put in the queue and no ERC20 and NATIVE can exist in the same queue
        exists =
          typeof this.wanted.find((w) => {
            return w.type === asset.type
          }) !== "undefined" ||
          typeof this.wanted.find((w) => {
            return w.type === "ERC20" || w.type === "NATIVE"
          }) !== "undefined"
      } else {
        exists =
          typeof this.wanted.find((w) => {
            return w.address.toLowerCase() === asset.address.toLowerCase()
          }) !== "undefined"
      }

      if (exists)
        throw new Error(
          "Only one ERC20 token or NATIVE token can be put in the queue."
        )

      this.wanted.push(asset)
    } else {
      if (asset.type === "NATIVE" || asset.type === "ERC20")
        throw new Error("This asset can not be a NATIVE token or ERC20 token.")

      let exists: boolean = false
      if (asset.type === "ERC721") {
        exists =
          typeof this.wanted.find((w) => {
            return (
              w.address.toLowerCase() === asset.address.toLowerCase() &&
              asset.tokenId?.toLowerCase() === w.tokenId?.toLowerCase()
            )
          }) !== "undefined"

        if (exists)
          throw new Error(
            "This asset cannot be added since it's already in the wanted queue."
          )

        this.wanted.push(asset)
      } else {
        let element = this.wanted.find((w) => {
          return (
            w.address.toLowerCase() === asset.address.toLowerCase() &&
            asset.tokenId?.toLowerCase() === w.tokenId?.toLowerCase()
          )
        })

        if (element) {
          let amount = ethers.BigNumber.from(element.amount).add(
            ethers.BigNumber.from(asset.amount)
          )
          const amountString = amount.toString()
          //just an update on the amount since it's already in the queue
          element.amount = amountString
        } else {
          this.wanted.push(asset)
        }
      }
    }

    if (!this.assets) this.assets = {}
    this.assets.wanted = this.wanted

    this._calculateTypeWanted()
  }

  /**
   * Adds an asset to the offered queue based on the asset type and existing assets in the queue.
   * @param {AssetItem} asset - The asset item to be added to the offered queue.
   * @returns None
   */
  addOfferedAsset(asset: AssetItem) {
    if (this.type !== POST_TYPE.R1) {
      if (asset.type === "ERC20" || asset.type === "NATIVE")
        throw new Error("This asset can not be an ERC20 or NATIVE token.")

      if (asset.type === "ERC721") {
        let exists: boolean =
          typeof this.offered.find((o) => {
            return (
              o.address.toLowerCase() === asset.address.toLowerCase() &&
              o.tokenId?.toLowerCase() === asset.tokenId?.toLowerCase()
            )
          }) !== "undefined"

        if (exists)
          throw new Error("This asset already exists in the offered queue.")

        this.offered.push(asset)
      } else {
        let element = this.offered.find((o) => {
          return (
            o.address.toLowerCase() === asset.address.toLowerCase() &&
            asset.tokenId?.toLowerCase() === o.tokenId?.toLowerCase()
          )
        })

        if (element) {
          let amount = ethers.BigNumber.from(element.amount).add(
            ethers.BigNumber.from(asset.amount)
          )
          const amountString = amount.toString()
          //just an update on the amount since it's already in the queue
          element.amount = amountString
        } else {
          this.offered.push(asset)
        }
      }
    } else {
      let exists: boolean = false
      if (asset.type === "ERC20" || asset.type === "NATIVE") {
        exists =
          typeof this.offered.find((o) => {
            return o.type === asset.type
          }) !== "undefined" ||
          typeof this.offered.find((o) => {
            return o.type === "NATIVE" || o.type === "ERC20"
          }) !== "undefined"

        if (exists)
          throw new Error(
            "Only one ERC20 token or NATIVE token can be put in the queue."
          )

        this.offered.push(asset)
      } else {
        exists =
          typeof this.offered.find((o) => {
            return (
              o.address.toLowerCase() === asset.address.toLowerCase() &&
              o.tokenId?.toLowerCase() === asset.tokenId?.toLowerCase()
            )
          }) !== "undefined"

        if (asset.type === "ERC721" && exists)
          throw new Error(
            "You cannot put the same ERC721 in the offered queue."
          )
        else if (
          (asset.type === "ERC721" || asset.type === "ERC1155") &&
          !exists
        )
          this.offered.push(asset)
        else if (asset.type === "ERC1155" && exists) {
          let element = this.offered.find((o) => {
            return (
              o.address.toLowerCase() === asset.address.toLowerCase() &&
              asset.tokenId?.toLowerCase() === o.tokenId?.toLowerCase()
            )
          })

          let amount = ethers.BigNumber.from(element!.amount).add(
            ethers.BigNumber.from(asset.amount)
          )
          const amountString = amount.toString()
          //just an update on the amount since it's already in the queue
          element!.amount = amountString
        }
      }
    }

    if (!this.assets) this.assets = {}
    this.assets.offered = this.offered

    this._calculateTypeOffered()
  }

  /**
   * Removes the specified asset from the wanted list based on certain conditions.
   * @param {AssetItem} asset - The asset item to be removed from the wanted list.
   * @returns None
   */
  removeWantedAsset(asset: AssetItem) {
    if (this.type !== POST_TYPE.R1) {
      if (asset.type !== "NATIVE") {
        this.wanted = this.wanted.filter((w) => {
          return w.address.toLowerCase() !== asset.address.toLowerCase()
        })
      } else {
        this.wanted = this.wanted.filter((w) => {
          return w.type !== "NATIVE"
        })
      }
    } else {
      if (asset.type === "ERC20" || asset.type === "NATIVE")
        throw new Error("Can not remove a token from the wanted queue.")

      this.wanted = this.wanted.filter((w) => {
        return (
          w.address.toLowerCase() !== asset.address.toLowerCase() &&
          w.tokenId?.toLowerCase() !== asset.tokenId?.toLowerCase()
        )
      })
    }

    if (this.assets?.wanted) this.assets.wanted = this.wanted

    this._calculateTypeWanted()
  }

  /**
   * Removes the provided asset from the offered assets list based on certain conditions.
   * @param {AssetItem} asset - The asset item to be removed.
   * @returns None
   */
  removeOfferedAsset(asset: AssetItem) {
    if (this.type !== POST_TYPE.R1) {
      if (asset.type === "ERC20" || asset.type === "NATIVE")
        throw new Error("Can not remove a token from the wanted queue.")

      this.offered = this.offered.filter((o) => {
        return (
          o.address.toLowerCase() !== asset.address.toLowerCase() &&
          o.tokenId !== asset.tokenId
        )
      })
    } else {
      if (asset.type === "ERC20") {
        this.offered = this.offered.filter((o) => {
          return o.address.toLowerCase() !== asset.address.toLowerCase()
        })
      } else if (asset.type === "NATIVE") {
        this.offered = this.offered.filter((o) => {
          return o.type !== "NATIVE"
        })
      } else {
        this.offered = this.offered.filter((o) => {
          return (
            o.address.toLowerCase() !== asset.address.toLowerCase() &&
            o.tokenId?.toLowerCase() !== asset.tokenId?.toLowerCase()
          )
        })
      }
    }

    if (this.assets?.offered) this.assets.offered = this.offered

    this._calculateTypeOffered()
  }

  /**
   * Sets the post type based on the specified criteria of what is being looked for and offered.
   * @param { "-1" | "0" | "1" | "2" } lookingFor - The type of post being looked for.
   * @param { "-1" | "0" | "1" } offer - The type of post being offered.
   * @returns None
   */
  setPostTypeBy(lookingFor: "-1" | "0" | "1" | "2", offer: "-1" | "0" | "1") {
    if (lookingFor === LookingFor.RESTRICTED && offer === Offer.RESTRICTED) {
      this.type = POST_TYPE.A1
      this.typeWanted[0] = "0"
      this.typeOffered[0] = "0"
    } else if (lookingFor === LookingFor.RESTRICTED && offer === Offer.OPEN) {
      this.type = POST_TYPE.A2
      this.typeWanted[0] = "0"
      this.typeOffered[0] = "1"
    } else if (
      lookingFor === LookingFor.FLEXIBLE &&
      offer === Offer.RESTRICTED
    ) {
      this.type = POST_TYPE.B1
      this.typeWanted[0] = "1"
      this.typeOffered[0] = "0"
    } else if (lookingFor === LookingFor.FLEXIBLE && offer === Offer.OPEN) {
      this.type = POST_TYPE.B2
      this.typeWanted[0] = "1"
      this.typeOffered[0] = "1"
    } else if (lookingFor === LookingFor.OPEN && offer === Offer.RESTRICTED) {
      this.type = POST_TYPE.C1
      this.typeWanted[0] = "2"
      this.typeOffered[0] = "0"
    } else if (lookingFor === "-1" && offer === "-1") this.type = POST_TYPE.R1
    else throw new Error("Post type combination not available.")
  }

  /**
   * Sets the post type based on the given PostTypeValue.
   * @param {PostTypeValue} postTypeValue - The post type value to set.
   * @returns None
   * @throws {Error} If the post type combination is not available.
   */
  setPostType(postTypeValue: PostTypeValue) {
    if (postTypeValue === POST_TYPE.A1) {
      this.type = POST_TYPE.A1
      this.typeWanted[0] = "0"
      this.typeOffered[0] = "0"
    } else if (postTypeValue === POST_TYPE.A2) {
      this.type = POST_TYPE.A2
      this.typeWanted[0] = "0"
      this.typeOffered[0] = "1"
    } else if (postTypeValue === POST_TYPE.B1) {
      this.type = POST_TYPE.B1
      this.typeWanted[0] = "1"
      this.typeOffered[0] = "0"
    } else if (postTypeValue === POST_TYPE.B2) {
      this.type = POST_TYPE.B2
      this.typeWanted[0] = "1"
      this.typeOffered[0] = "1"
    } else if (postTypeValue === POST_TYPE.C1) {
      this.type = POST_TYPE.C1
      this.typeWanted[0] = "2"
      this.typeOffered[0] = "0"
    } else if (postTypeValue === POST_TYPE.R1) this.type = POST_TYPE.R1
    else throw new Error("Post type combination not available.")
  }

  /**
   * Set the expiration date based on the current date and a given duration.
   * @param {number} duration - The duration in days to add to the current date.
   * @returns None
   */
  setPostDuration(duration: number) {
    const today = new Date()
    this.expirationDate = new Date(today.setDate(today.getDate() + duration))
  }

  /**
   * Set the parent ID for a post.
   * @param {string} parentId - The ID of the parent post.
   * @returns None
   */
  setPostParentId(parentId: string) {
    this.parentId = parentId
  }

  /**
   * Factory method that creates a PostLike object based on the current state of the builder.
   * @returns {PostLike} A PostLike object with the properties set by the builder.
   */
  factory(): PostLike {
    this._validation()
    this.type! !== POST_TYPE.R1 &&
      this.messages!.push({ type: this._getMessage() })

    const post = {
      id: this.postId,
      parentId: this.parentId,
      status: POST_STATUS.ACTIVE,
      type: this.type!,
      creationDate: Math.floor(this.creationDate.getTime() / 1000),
      networkId: this.networkId,
      expirationDate:
        this.type! !== POST_TYPE.R1
          ? Math.floor(this.expirationDate!.getTime() / 1000)
          : null,
      creator: {
        username: "",
        address: this.creatorAddress ? this.creatorAddress : "",
        imageUrl: "",
        isNft: 0 as 0,
        isVerified: 0 as 0,
      },
      messages: this.messages!,
      assets: this.assets!,
      typeWanted: this.typeWanted.join(""),
      typeOffered: this.typeOffered.join(""),
    }

    this._reset()

    return post
  }

  /**
   * Extracts relevant information from a PostLike object to create a PostObject.
   * @param {PostLike} post - The PostLike object to extract information from.
   * @returns {PostObject} A new PostObject containing selected properties from the PostLike object.
   */
  getCreatePost(post: PostLike): PostObject {
    return {
      assets: post.assets,
      creatorAddress: post.creator.address,
      expirationDate: post.expirationDate!,
      messages: post.messages,
      networkId: post.networkId,
      type: post.type,
    }
  }

  /**
   * Creates a PostReplyObject based on the provided PostLike object.
   * @param {PostLike} post - The PostLike object to create a reply from.
   * @returns {PostReplyObject} A new PostReplyObject with creator address, assets, messages, networkId, and parentId.
   */
  getCreatePostReply(post: PostLike): PostReplyObject {
    return {
      creatorAddress: post.creator.address,
      assets: post.assets,
      messages: post.messages,
      networkId: post.networkId,
      parentId: post.parentId!,
    }
  }
}
