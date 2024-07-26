import { ApiKeyAuthorized, Maybe } from "./types/base"
import {
  ListPostsFilters,
  ListPostsOrder,
  ListPostsResponse,
} from "./interfaces/post"
import {
  PostObject,
  PostReplyObject,
  PostStatus,
  PostType,
  PostItem,
} from "./types/post"
import { validateListPostsFilters } from "./core/utilities"
import { POST_STATUS } from "./constants/post/poststatus"
import { POST_TYPE } from "./constants/post/posttype"
import { HTTPClient } from "./core/httpclient"
import { ApiResponse } from "./types/base/apiresponse"

/**
 * Represents a class for interacting with posts through HTTP requests.
 * @class Post
 * @extends HTTPClient
 */
export class Post extends HTTPClient {
  /**
   * Get the POST_STATUS constant object.
   * @returns {PostStatus} The constant object POST_STATUS.
   */
  static get POST_STATUS(): PostStatus {
    return { ...POST_STATUS }
  }

  /**
   * Returns a copy of the POST_TYPE object as a constant PostType.
   * @returns {PostType} A copy of the POST_TYPE object.
   */
  static get POST_TYPE(): PostType {
    return { ...POST_TYPE }
  }

  /**
   * Returns the message that needs to be signed, which is used by nfttrader.io for verification.
   * @returns {string} The message to sign powered by nfttrader.io
   */
  static get _MESSAGE_TO_SIGN(): string {
    return `This is the message to sign powered by nfttrader.io`
  }

  /**
   * Constructor for creating an instance of a class that requires an API key for authorization.
   * @param {ApiKeyAuthorized} config - The configuration object containing the API key.
   * @returns None
   */
  constructor(config: ApiKeyAuthorized) {
    super()
    this._apiKey = config.apiKey
  }

  /**
   * Creates a new post object and inserts it into the backend.
   * @param {P} post - The post object to be inserted, which can be either a PostObject or PostReplyObject.
   * @returns A Promise that resolves to a string or null.
   * @throws {Error} If signedMessage is required but not provided.
   */
  private async _createPost<
    P extends (PostObject | PostReplyObject) &
      Partial<Pick<PostItem, "parentId">>
  >(post: P): Promise<boolean> {
    try {
      const { response, statusCode } = await this._fetch<ApiResponse<boolean>>(
        `${this.backendUrl()}/post/insert`,
        {
          method: "POST",
          body: post,
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (statusCode !== 200 || !response || !response.data) return false

      return true
    } catch (error) {
      console.warn(error)
    }

    return false
  }

  /**
   * Retrieves a post instance with the given ID and optional creator address.
   * @param {string} id - The ID of the post instance to retrieve.
   * @param {string} [did] - The creator address associated with the post instance. If provided, the API checks if the creatorAddress is the creator of the post.
   * @returns {Promise<Maybe<PostItem>>} A promise that resolves to the retrieved post instance, or null if not found.
   * @throws {Error} If the "id" parameter is invalid or if an error occurs during the retrieval process.
   */
  async get(id: string, did?: string): Promise<Maybe<PostItem>> {
    if (!id) throw new Error('Invalid parameter "id".')

    try {
      const { response } = await this._fetch<ApiResponse<PostItem>>(
        `${this.backendUrl()}/post/${id}` + `${did ? `/${did}` : ``}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves a list of posts based on the provided filters, order options, skip, take, and creator address.
   * @param {ListPostsFilters} filtersOptions - The filters to apply to the list of posts.
   * @param {ListPostsOrder} orderOptions - The order in which the posts should be listed.
   * @param {number} skip - The number of posts to skip.
   * @param {number} take - The number of posts to retrieve.
   * @param {string} creatorAddress - The address of the post creator.
   * @returns {Promise<ListPostsResponse>} A promise that resolves to a ListPostsResponse object containing the list of posts and total count.
   */
  async list(
    filtersOptions?: ListPostsFilters,
    orderOptions?: ListPostsOrder,
    skip?: number,
    take?: number,
    did?: string
  ): Promise<Maybe<ListPostsResponse>> {
    const filtersInput = filtersOptions ? { ...filtersOptions } : null

    let filters = null
    if (filtersInput) {
      try {
        validateListPostsFilters(filtersInput)
      } catch (e) {
        throw e
      }
      const { collections, status, type, offers } = filtersInput
      delete filtersInput.collections
      delete filtersInput.status
      delete filtersInput.type
      delete filtersInput.offers

      if (collections) filters = { ...(filters ?? {}), collections }

      if (status || typeof status === "number")
        // status can be a number equal to zero (active), so it's better to check typeof
        filters = {
          ...(filters ?? {}),
          status:
            typeof status === "string" ? Post.POST_STATUS[status] : status,
        }
      if (type || typeof type === "number")
        // type can be a number equal to zero (A1), so it's better to check typeof
        filters = {
          ...(filters ?? {}),
          type: typeof type === "string" ? Post.POST_TYPE[type] : type,
        }

      if (offers) filters = { ...(filters ?? {}), offers }

      filters = Object.fromEntries(
        Object.entries({ ...(filters ?? {}), ...filtersInput }).filter(
          ([_name, value]) => value !== undefined && value !== null
        )
      )
    }

    const order = orderOptions ? { ...orderOptions } : null
    const skipUrl = skip && skip >= 0 ? skip : 0
    const takeUrl = take && take > 0 ? take : 10
    const body = {
      filters: filters ? (Object.keys(filters).length ? filters : null) : null,
      order,
    }

    try {
      const { response } = await this._fetch<ApiResponse<ListPostsResponse>>(
        `${this.backendUrl()}/posts/${skipUrl}/${takeUrl}${
          did ? `/${did}` : ``
        }`,
        {
          method: "POST",
          body,
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response || response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Creates a new post using the provided post object and signed message.
   * @param {PostObject} post - The post object containing the post data.
   * @returns A new post created using the provided data.
   */
  async create(post: PostObject, signedMessage: string) {
    return this._createPost(post)
  }

  /**
   * Deletes a post with the given ID.
   * @param {string} id - The ID of the post to delete.
   * @param {string} creatorAddress - The address of the creator of the post.
   * @returns {Promise<void>} A promise that resolves when the post is successfully deleted.
   * @throws {Error} If the signedMessage is required but not provided.
   */
  async delete(id: string, creatorAddress: string): Promise<void> {
    try {
      await this._fetch(`${this.backendUrl()}/post/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this._authToken}`,
          "x-api-key": `${this._apiKey}`,
        },
        body: {
          creatorAddress,
        },
      })
    } catch (error) {
      console.warn(error)
    }
  }
}
