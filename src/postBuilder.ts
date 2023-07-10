import POST_STATUS from "./lib/postClient/postStatus"
import POST_TYPE from "./lib/postClient/postType"
import Maybe from "./types/general/maybe"
import AssetItem from "./types/postBuilder/assetItem"
import LookingFor from "./types/postBuilder/lookingFor"
import Offer from "./types/postBuilder/offer"
import CreatePost from "./types/postClient/createPost"
import CreatePostAssets from "./types/postClient/createPostAssets"
import CreatePostReply from "./types/postClient/createPostReply"
import PostLike from "./types/postClient/postLike"
import PostTypeValue from "./types/postClient/postTypeValue"
import { ethers } from "ethers"

export default class PostBuilder {
  private postId: string = ""
  private parentId: string = ""
  private type: Maybe<PostTypeValue> = null
  private creationDate: Date = new Date()
  private networkId: string = ""
  private expirationDate: Maybe<Date> = null
  private creatorAddress: Maybe<string> = null
  private messages: Maybe<Array<{ type: string }>> = null
  private assets: Maybe<CreatePostAssets> = {}
  private wanted: AssetItem[] = []
  private offered: AssetItem[] = []
  private typeWanted: Array<string> = ["0", "0", "0"]
  private typeOffered: Array<string> = ["0", "0", "0"]

  /**
   *
   * @param networkId - the network id of the Post object
   * @param creatorAddress - the creator address of the Post object
   */
  constructor(networkId?: string, creatorAddress?: string) {
    if (networkId) this.networkId = networkId
    if (creatorAddress) this.creatorAddress = creatorAddress
  }

  /**
   * Set the network id for this post
   *
   * @param networkId - The network id of this post
   */
  setNetworkId(networkId: string) {
    this.networkId = networkId
  }

  /**
   * Set intro message for this post
   *
   * @param code - The code of the message post
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
   * Set the creator address of this post
   *
   * @param address - The creator address of this post
   */
  setPostCreator(address: string) {
    this.creatorAddress = address
  }

  /**
   * Add a wanted asset for this post
   *
   * @param asset - The asset wanted for this post
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
   * Add an offered asset for this post
   *
   * @param asset - The asset offered for this post
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
   * Remove a wanted asset for this post
   *
   * @param asset - The asset wanted for this post to remove
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
   * Remove an offered asset for this post
   *
   * @param asset - The asset offered for this post
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
   * Set the post type for this post
   *
   * @param lookingFor - The lookingFor code for this post
   * @param offer - The offer code for this post
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
   * Set the post type for this post
   *
   * @param postTypeValue - The post type value code for this post
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
   * Set the duration for this post
   *
   * @param duration - The duration for this post
   */
  setPostDuration(duration: number) {
    const today = new Date()
    this.expirationDate = new Date(today.setDate(today.getDate() + duration))
  }

  /**
   * Set the parent id for this post reply
   *
   * @param parentId - The parent id of this reply post
   */
  setPostParentId(parentId: string) {
    this.parentId = parentId
  }

  /**
   * Build the post like object
   *
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
   * Get a CreatePost instance of the post object given as parameter
   *
   * @param post - The post like object
   */
  getCreatePost(post: PostLike): CreatePost {
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
   * Get a getCreatePostReply instance of the post object given as parameter
   *
   * @param post - The post like object
   */
  getCreatePostReply(post: PostLike): CreatePostReply {
    return {
      creatorAddress: post.creator.address,
      assets: post.assets,
      messages: post.messages,
      networkId: post.networkId,
      parentId: post.parentId!,
    }
  }

  /**
   * validation function
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
   * Calculate the type wanted checking the wanted assets array
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
   * Calculate the type offered checking the offered assets array
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
   * Get the second item for the message object
   */
  private _getMessage() {
    return `${this.typeWanted.join("")}_${this.typeOffered.join("")}`
  }

  /**
   * Reset all the variables used to build a post
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
}
