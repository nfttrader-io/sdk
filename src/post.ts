import { Maybe } from "./types/base"
import { HTTPResponse, HTTPRequestInit } from "./interfaces/base"
import {
  ListPostsFilters,
  ListPostsOrder,
  ListPostsResponse,
  ListPostsRepliesOrder,
} from "./interfaces/post"
import {
  PostObject,
  PostReplyObject,
  PostStatus,
  PostType,
  PostInstance,
  ApiKeyAuthorized,
  PostConfig,
} from "./types/post"
import { validateListPostsFilters } from "./core/utilities"
import { POST_STATUS } from "./constants/post/poststatus"
import { POST_TYPE } from "./constants/post/posttype"
import { HTTPClient } from "./core/httpclient"

/**
 * Represents a class for interacting with posts through HTTP requests.
 * @class Post
 * @extends HTTPClient
 */
export class Post extends HTTPClient {
  /**
   * @type {Maybe<string>} _apiKey - The API key, which may be null.
   */
  private _apiKey: Maybe<string> = null
  /**
   * @type {string} _BACKEND_URL - The backend URL for API requests.
   */
  private _BACKEND_URL: string = "https://api.nfttrader.io"

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
   * Makes a fetch request with authentication headers.
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} [options] - The options for the fetch request.
   * @returns {Promise<HTTPResponse<ReturnType>>} A promise that resolves to the HTTP response.
   */
  private _fetchWithAuth<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    }
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      "x-api-key": `${this._apiKey}`,
    }

    return this._fetch(url, options)
  }

  /**
   * Creates a new post object and inserts it into the backend.
   * @param {P} post - The post object to be inserted, which can be either a PostObject or PostReplyObject.
   * @param {string} signedMessage - The signed message for authentication.
   * @returns A Promise that resolves to a string or null.
   * @throws {Error} If signedMessage is required but not provided.
   */
  private async _createPost<
    P extends (PostObject | PostReplyObject) &
      Partial<Pick<PostInstance, "parentId">>
  >(post: P, signedMessage: string): Promise<Maybe<string>> {
    if (this._apiKey && !signedMessage)
      throw new Error("signedMessage must be provided.")

    try {
      const res = await this._fetchWithAuth<string>(
        `${this._BACKEND_URL}/post/insert`,
        {
          method: "POST",
          body: post,
          headers: {
            "nfttrader-signed-message": signedMessage,
          },
        }
      )

      return res.data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Retrieves a post instance with the given ID and optional creator address.
   * @param {string} id - The ID of the post instance to retrieve.
   * @param {string} [creatorAddress] - The creator address associated with the post instance.
   * @returns {Promise<Maybe<PostInstance>>} A promise that resolves to the retrieved post instance, or null if not found.
   * @throws {Error} If the "id" parameter is invalid or if an error occurs during the retrieval process.
   */
  async get(id: string, creatorAddress?: string): Promise<Maybe<PostInstance>> {
    if (!id) throw new Error('Invalid parameter "id"')

    try {
      const { data } = await this._fetchWithAuth<PostInstance>(
        `${this._BACKEND_URL}/post/${id}` +
          `${creatorAddress ? `/${creatorAddress}` : ``}`
      )

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Retrieves a list of replies for a specific post ID.
   * @param {string} id - The ID of the post to retrieve replies for.
   * @param {ListPostsRepliesOrder} [orderOptions] - The order options for listing replies.
   * @param {number} [skip] - The number of replies to skip.
   * @param {number} [take] - The number of replies to retrieve.
   * @param {string} [creatorAddress] - The address of the creator for filtering replies.
   * @returns {Promise<ListPostsResponse>} A promise that resolves to a ListPostsResponse object containing the list of replies.
   * @throws {Error} If the "id" parameter is invalid or if an error
   */
  async listReplies(
    id: string,
    orderOptions?: ListPostsRepliesOrder,
    skip?: number,
    take?: number,
    creatorAddress?: string
  ): Promise<ListPostsResponse> {
    if (!id) throw new Error('Invalid parameter "id"')

    const body = {
      orderOptions,
    }

    const skipUrl = skip && skip >= 0 ? skip : 0
    const takeUrl = take && take > 0 ? take : 10

    try {
      const { data } = await this._fetchWithAuth<ListPostsResponse>(
        `${this._BACKEND_URL}/replies/${id}/${skipUrl}/${takeUrl}` +
          `${creatorAddress ? `/${creatorAddress}` : ``}`,
        {
          method: "POST",
          body,
        }
      )

      return data ?? { posts: [], total: 0 }
    } catch (e) {
      throw e
    }
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
    creatorAddress?: string
  ): Promise<ListPostsResponse> {
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
      const { data } = await this._fetchWithAuth<ListPostsResponse>(
        `${this._BACKEND_URL}/posts/${skipUrl}/${takeUrl}${
          creatorAddress ? `/${creatorAddress}` : ``
        }`,
        {
          method: "POST",
          body,
        }
      )

      return data ?? { posts: [], total: 0 }
    } catch (e) {
      throw e
    }
  }

  /**
   * Creates a new post using the provided post object and signed message.
   * @param {PostObject} post - The post object containing the post data.
   * @param {string} signedMessage - The signed message associated with the post.
   * @returns A new post created using the provided data.
   */
  async create(post: PostObject, signedMessage: string) {
    return this._createPost(post, signedMessage)
  }

  /**
   * Reply to a post with the given reply object and signed message.
   * @param {PostReplyObject} reply - The reply object containing the post details.
   * @param {string} signedMessage - The signed message for authentication.
   * @returns A promise that resolves to the created post.
   */
  async reply(reply: PostReplyObject, signedMessage: string) {
    const type: number = POST_TYPE.R1
    return this._createPost({ ...reply, type }, signedMessage)
  }

  /**
   * Deletes a post with the given ID.
   * @param {string} id - The ID of the post to delete.
   * @param {string} creatorAddress - The address of the creator of the post.
   * @param {string} [signedMessage] - The signed message for authentication.
   * @returns {Promise<void>} A promise that resolves when the post is successfully deleted.
   * @throws {Error} If the signedMessage is required but not provided.
   */
  async delete(
    id: string,
    creatorAddress: string,
    signedMessage?: string
  ): Promise<void> {
    try {
      if (this._apiKey && !signedMessage)
        throw new Error("signedMessage must be provided.")

      await this._fetchWithAuth(`${this._BACKEND_URL}/post/${id}/delete`, {
        method: "DELETE",
        headers: {
          "nfttrader-signed-message": signedMessage!,
        },
        body: {
          creatorAddress,
        },
      })
    } catch (e) {
      throw e
    }
  }

  /**
   * Sets the backend URL in the configuration object.
   * @param {PostConfig} config - The configuration object containing the backend URL.
   * @returns None
   */
  config(config: PostConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
  }
}
