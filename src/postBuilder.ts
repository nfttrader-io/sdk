import POST_STATUS from "./lib/postClient/postStatus"
import POST_TYPE from "./lib/postClient/postType"
import MessageMap from "./messageMap"
import AssetItem from "./types/postBuilder/assetItem"
import LookingFor from "./types/postBuilder/lookingFor"
import Offer from "./types/postBuilder/offer"
import Collector from "./types/postClient/collector"
import CreatePost from "./types/postClient/createPost"
import CreatePostReply from "./types/postClient/createPostReply"
import Post from "./types/postClient/post"
import PostAsset from "./types/postClient/postAsset"
import PostTypeValue from "./types/postClient/postTypeValue"
import { ethers } from "ethers"

export default class PostBuilder {
  private postId: string = ""
  private parentId: string = ""
  private score: number = 0
  private like: number = 0
  private assetsChecked: boolean = false
  private type: PostTypeValue | null = null
  private creationDate: Date = new Date()
  private networkId: string = ""
  private expirationDate: Date | null = null
  private numberOffers: number = 0
  private accepted: boolean = false
  private creator: Collector | null = null
  private messages: Array<{ type: string }> | null = null
  private assets: {
    wanted?: PostAsset[]
    offered?: PostAsset[]
  } | null = {}
  private wanted: PostAsset[] = []
  private offered: PostAsset[] = []
  private isCreator: boolean = false
  private typeWanted: Array<string> = ["0", "0", "0"]
  private typeOffered: Array<string> = ["0", "0", "0"]

  /**
   *
   * @param networkId - the network id of the Post object
   * @param creator - the creator of the Post object
   */
  constructor(networkId?: string, creator?: Collector) {
    if (networkId) this.networkId = networkId
    if (creator) this.creator = creator
  }

  /**
   * Set the network id for this post
   *
   * @param code - The code of the message post
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
   * Set the creator of this post
   *
   * @param creator - The creator of this post
   */
  setPostCreator(creator: Collector) {
    this.creator = creator
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
        exists =
          this.wanted.find((w) => {
            return w.type === asset.type
          }) !== null
      } else {
        exists =
          this.wanted.find((w) => {
            return w.address.toLowerCase() === asset.address.toLowerCase()
          }) !== null
      }

      if (exists)
        throw new Error(
          asset.type !== "ERC20"
            ? "This asset already exists in the wanted queue."
            : "You can not put more than one ERC20 token in the queue"
        )

      this.wanted.push({
        ...asset,
        statusVerification: 0,
        name: "",
        abi: [],
        isNft: asset.type === "ERC1155" || asset.type === "ERC721",
        symbol: "",
        createdAt: "",
        amountHumanReadable: "",
        checked: false,
        isDifferent: false,
      })
    } else {
      if (asset.type === "NATIVE" || asset.type === "ERC20")
        throw new Error("This asset cannot be a NATIVE token or ERC20 token.")

      let exists: boolean = false
      if (asset.type === "ERC721") {
        exists =
          this.wanted.find((w) => {
            return (
              w.address.toLowerCase() === asset.address.toLowerCase() &&
              asset.tokenId === w.tokenId
            )
          }) !== null

        if (exists)
          throw new Error(
            "This asset cannot be added since it's already in the wanted queue."
          )

        this.wanted.push({
          ...asset,
          statusVerification: 0,
          name: "",
          abi: [],
          isNft: true,
          symbol: "",
          createdAt: "",
          amountHumanReadable: "",
          checked: false,
          isDifferent: false,
        })
      } else {
        let element = this.wanted.find((w) => {
          return (
            w.address.toLowerCase() === asset.address.toLowerCase() &&
            asset.tokenId === w.tokenId
          )
        })

        if (element) {
          let amount = ethers.BigNumber.from(element.amount).add(
            ethers.BigNumber.from(asset.amount)
          )
          const amountString = amount.toString()
          element.amount = amountString
        } else {
          this.wanted.push({
            ...asset,
            statusVerification: 0,
            name: "",
            abi: [],
            isNft: true,
            symbol: "",
            createdAt: "",
            amountHumanReadable: "",
            checked: false,
            isDifferent: false,
          })
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
        throw new Error("This asset cannot be an ERC20 or NATIVE token.")

      if (asset.type === "ERC721") {
        let exists: boolean =
          this.offered.find((o) => {
            return o.address.toLowerCase() === asset.address.toLowerCase()
          }) !== null

        if (exists)
          throw new Error("This asset already exists in the offered queue.")

        this.offered.push({
          ...asset,
          statusVerification: 0,
          name: "",
          abi: [],
          isNft: true,
          symbol: "",
          createdAt: "",
          amountHumanReadable: "",
          checked: false,
          isDifferent: false,
        })
      } else {
        let element = this.offered.find((o) => {
          return (
            o.address.toLowerCase() === asset.address.toLowerCase() &&
            asset.tokenId === o.tokenId
          )
        })

        if (element) {
          let amount = ethers.BigNumber.from(element.amount).add(
            ethers.BigNumber.from(asset.amount)
          )
          const amountString = amount.toString()
          element.amount = amountString
        } else {
          this.offered.push({
            ...asset,
            statusVerification: 0,
            name: "",
            abi: [],
            isNft: true,
            symbol: "",
            createdAt: "",
            amountHumanReadable: "",
            checked: false,
            isDifferent: false,
          })
        }
      }
    } else {
      let exists: boolean = false
      if (asset.type === "ERC20" || asset.type === "NATIVE") {
        exists =
          this.offered.find((o) => {
            return o.type === asset.type
          }) !== null

        if (exists)
          throw new Error(
            "You cannot put more than one token in the same time."
          )

        this.offered.push({
          ...asset,
          statusVerification: 0,
          name: "",
          abi: [],
          isNft: false,
          symbol: "",
          createdAt: "",
          amountHumanReadable: "",
          checked: false,
          isDifferent: false,
        })
      } else {
        exists =
          this.offered.find((o) => {
            return (
              o.address.toLowerCase() === asset.address.toLowerCase() &&
              o.tokenId === asset.tokenId
            )
          }) !== null

        if (asset.type === "ERC721" && exists)
          throw new Error(
            "You cannot put the same ERC721 in the offered queue."
          )
        else if (
          (asset.type === "ERC721" || asset.type === "ERC1155") &&
          !exists
        )
          this.offered.push({
            ...asset,
            statusVerification: 0,
            name: "",
            abi: [],
            isNft: true,
            symbol: "",
            createdAt: "",
            amountHumanReadable: "",
            checked: false,
            isDifferent: false,
          })
        else if (asset.type === "ERC1155" && exists) {
          let element = this.offered.find((o) => {
            return (
              o.address.toLowerCase() === asset.address.toLowerCase() &&
              asset.tokenId === o.tokenId
            )
          })

          let amount = ethers.BigNumber.from(element!.amount).add(
            ethers.BigNumber.from(asset.amount)
          )
          const amountString = amount.toString()
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
        throw new Error("Cannot remove a token from the wanted queue.")

      this.wanted = this.wanted.filter((w) => {
        return (
          w.address.toLowerCase() !== asset.address.toLowerCase() &&
          w.tokenId !== asset.tokenId
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
        throw new Error("Cannot remove a token from the wanted queue.")

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
            o.tokenId !== asset.tokenId
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
   * Build the post object
   *
   */
  factory(): Post {
    this._validation()
    this.messages!.push({ type: this._getMessage() })

    const post = {
      id: this.postId,
      parentId: this.parentId,
      score: this.score,
      like: this.like,
      assetsChecked: this.assetsChecked,
      status: POST_STATUS.ACTIVE,
      type: this.type!,
      creationDate: Math.floor(this.creationDate.getTime() / 1000),
      networkId: this.networkId,
      expirationDate: Math.floor(this.expirationDate!.getTime() / 1000),
      numberOffers: this.numberOffers,
      accepted: this.accepted,
      creator: this.creator!,
      messages: this.messages!,
      assets: this.assets!,
      isCreator: this.isCreator,
    }

    this._reset()

    return post
  }

  /**
   * Get a CreatePost instance of the post object given as parameter
   *
   * @param post - The post object
   */
  getCreatePost(post: Post): CreatePost {
    return {
      assets: post.assets,
      creatorAddress: post.creator.address,
      expirationDate: post.expirationDate,
      messages: post.messages,
      networkId: post.networkId,
      type: post.type,
    }
  }

  /**
   * Get a getCreatePostReply instance of the post object given as parameter
   *
   * @param post - The post object
   */
  getCreatePostReply(
    creatorAddress: string,
    wanted: PostAsset[],
    offered: PostAsset[],
    messages: Array<{ type: string }>,
    networkId: string
  ): CreatePostReply {
    return {
      creatorAddress,
      assets: {
        wanted,
        offered,
      },
      messages,
      networkId,
    }
  }

  /**
   * validation function
   */
  private _validation() {
    if (!this.assets) throw new Error("Assets must be setted.")
    if (!this.type)
      throw new Error(
        "Post type must be setted. Call setPostType() method before."
      )
    if (!this.expirationDate)
      throw new Error(
        "Expiration date must be setted. Call setPostDuration() method before."
      )
    if (!this.creator)
      throw new Error(
        "Creator must be setted. Call setPostCreator() method before."
      )

    if (this.type === POST_TYPE.A1 || this.type === POST_TYPE.B1) {
      if (!this.assets!.wanted || this.assets!.wanted.length === 0)
        throw new Error(
          `wanted assets cannot be empty if the post type is [${
            this.type === POST_TYPE.A1 ? `A1` : `B1`
          }]`
        )
      else if (!this.assets!.offered || this.assets!.offered.length === 0)
        throw new Error(
          `offered assets cannot be empty if the post type is [${
            this.type === POST_TYPE.A1 ? `A1` : `B1`
          }]`
        )
    } else if (this.type === POST_TYPE.A2 || this.type === POST_TYPE.B2) {
      if (!this.assets!.wanted || this.assets!.wanted.length === 0)
        throw new Error(
          `wanted assets cannot be empty if the post type is [${
            this.type === POST_TYPE.A2 ? `A2` : `B2`
          }]`
        )
      else if (this.assets!.offered && this.assets!.offered.length > 0)
        throw new Error(
          `offered assets cannot be filled if the post type is [${
            this.type === POST_TYPE.A2 ? `A2` : `B2`
          }]`
        )
    } else if (this.type === POST_TYPE.C1) {
      if (this.assets!.wanted && this.assets!.wanted.length > 0)
        throw new Error(
          `wanted assets cannot be filled if the post type is [C1]`
        )
      else if (!this.assets!.offered || this.assets!.offered.length === 0)
        throw new Error(
          `offered assets cannot be empty if the post type is [C1]`
        )
    } else if (this.type === POST_TYPE.R1) {
      if (!this.assets!.wanted || this.assets!.wanted.length === 0)
        throw new Error(
          `wanted assets cannot be empty if the post type is [R1]`
        )
      else if (!this.assets!.offered || this.assets!.offered.length === 0)
        throw new Error(
          `offered assets cannot be empty if the post type is [R1]`
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
      w.type === "ERC1155" || (w.type === "ERC721" && countNFT++)
      w.type === "ERC20" || (w.type === "NATIVE" && countToken++)
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
      o.type === "ERC1155" || (o.type === "ERC721" && countNFT++)
      o.type === "ERC20" || (o.type === "NATIVE" && countToken++)
    }

    this.typeOffered[1] = countToken === 0 ? "0" : countToken === 1 ? "1" : "2"
    this.typeOffered[2] = countNFT === 0 ? "0" : countNFT === 1 ? "1" : "2"
  }

  /**
   * Get the second item for the message object
   */
  private _getMessage() {
    return MessageMap.MESSAGE_MATRIX[
      `${this.typeWanted.join("")}_${this.typeOffered.join(
        ""
      )}` as keyof MessageMap
    ]
  }

  /**
   * Reset all the variables used to build a post
   */
  private _reset() {
    this.postId = ""
    this.parentId = ""
    this.score = 0
    this.like = 0
    this.assetsChecked = false
    this.type = null
    this.creationDate = new Date()
    this.networkId = ""
    this.expirationDate = null
    this.numberOffers = 0
    this.accepted = false
    this.creator = null
    this.messages = null
    this.assets = null
  }
}
