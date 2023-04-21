import POST_STATUS from "./lib/postClient/postStatus"
import POST_TYPE from "./lib/postClient/postType"
import LookingFor from "./types/postBuilder/lookingFor"
import Offer from "./types/postBuilder/offer"
import Collector from "./types/postClient/collector"
import CreatePost from "./types/postClient/createPost"
import CreatePostReply from "./types/postClient/createPostReply"
import Post from "./types/postClient/post"
import PostAsset from "./types/postClient/postAsset"
import PostTypeValue from "./types/postClient/postTypeValue"

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
  private assets: {} | null = {}
  private wanted: PostAsset[] = []
  private offered: PostAsset[] = []
  private isCreator: boolean = false
  private lookingForValue: "-1" | "0" | "1" | "2" | null = null
  private offerValue: "-1" | "0" | "1" | null = null
  private typeWanted: Array<string> = []
  private typeOffered: Array<string> = []

  constructor(networkId: string) {
    this.networkId = networkId
  }

  setPostCreator(creator: Collector) {
    this.creator = creator
  }

  addWantedAsset(asset: PostAsset) {
    if (this.type !== POST_TYPE.R1) {
    } else {
    }
  }

  addOfferedAsset(asset: PostAsset) {}

  removeWantedAsset(asset: PostAsset) {}

  removeOfferedAsset(asset: PostAsset) {}

  setPostType(lookingFor: "-1" | "0" | "1" | "2", offer: "-1" | "0" | "1") {
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

    this.lookingForValue = lookingFor
    this.offerValue = offer
  }

  setPostDuration(duration: number) {
    const today = new Date()
    this.expirationDate = new Date(today.setDate(today.getDate() + duration))
  }

  factory(): Post {
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
    if (!this.messages)
      throw new Error(
        "Message must be setted. Call setMessage() method before."
      )
    if (!this.assets) throw new Error("Assets must be setted.")

    return {
      id: this.postId,
      parentId: this.parentId,
      score: this.score,
      like: this.like,
      assetsChecked: this.assetsChecked,
      status: POST_STATUS.ACTIVE,
      type: this.type,
      creationDate: Math.floor(this.creationDate.getTime() / 1000),
      networkId: this.networkId,
      expirationDate: Math.floor(this.expirationDate.getTime() / 1000),
      numberOffers: this.numberOffers,
      accepted: this.accepted,
      creator: this.creator,
      messages: this.messages,
      assets: this.assets,
      isCreator: this.isCreator,
    }
  }

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
    * 
    * const currentPost: Post = {
        id: "",
        parentId: "",
        score: 0,
        like: 0,
        assetsChecked: false,
        status: POST_STATUS.ACTIVE,
        type: postType!,
        creationDate: Math.floor(today.getTime() / 1000),
        networkId: currentNetworkId!,
        expirationDate: Math.floor(
          new Date(today.setDate(today.getDate() + dayDuration!)).getTime() /
            1000
        ),
        numberOffers: 0,
        accepted: false,
        creator: maker!.collector!,
        messages: getMessages(
          typeWanted.join(""),
          typeOffered.join(""),
          messages
        ),
        assets: {
          wanted: getWanted(postType!, taker),
          offered: getOffered(postType!, maker),
        },
        isCreator: true,
      }
    * 
    */
}
