import Maybe from "../types/general/maybe"
import HTTPResponse from "../types/general/httpResponse"
import HTTPRequestInit from "../types/general/httpRequestInit"
import ListPostsFilters from "../interfaces/post/listPostsFilters"
import ListPostsOrder from "../interfaces/post/listPostsOrder"
import ListPostsResponse from "../interfaces/post/listPostsResponse"
import PostObject from "../types/post/postObject"
import PostReplyObject from "../types/post/postReplyObject"
import PostStatus from "../types/post/postStatus"
import validateListPostsFilters from "../lib/post/validateListPostsFilters"
import PostType from "../types/post/postType"
import PostInstance from "../types/post/postInstance"
import POST_STATUS from "../lib/post/postStatus"
import POST_TYPE from "../lib/post/postType"
import HTTPClient from "../lib/httpClient"
import ApiKeyAuthorized from "../types/post/apiKeyAuthorized"
import PostClientConfig from "../types/post/postClientConfig"
import ListPostsRepliesOrder from "../interfaces/post/listPostsRepliesOrder"

export default class Post extends HTTPClient {
  private _apiKey: Maybe<string> = null
  private _BACKEND_URL: string = "https://api.nfttrader.io"

  public static get POST_STATUS(): PostStatus {
    return { ...POST_STATUS }
  }

  public static get POST_TYPE(): PostType {
    return { ...POST_TYPE }
  }

  public static get _MESSAGE_TO_SIGN(): string {
    return `This is the message to sign powered by nfttrader.io`
  }

  constructor(config: ApiKeyAuthorized) {
    super()
    this._apiKey = config.apiKey
  }

  /**
   * Get a post by its id
   *
   * @param id - The id of the post
   * @param creatorAddress - The creator of the post
   */
  public async get(
    id: string,
    creatorAddress?: string
  ): Promise<Maybe<PostInstance>> {
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
   * Get a post replies by the parent post id
   *
   * @param id - The id of the parent post
   * @param orderOptions - An object that contains order options, to see available order options visit [this link](https://docs.nfttrader.io)
   * @param skip - A number representing the number of posts to skip (used for the pagination)
   * @param take - A number representing the number of posts to take (used for the pagination)
   * @param creatorAddress - A string representing the address of the wallet owner. Used to set the isCreator value to true in the case a post is created by this address
   */
  public async listReplies(
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
   * List posts that match the filter and order object
   *
   * @param filtersOptions - An object that contains filter options, to see available filter options visit [this link](https://docs.nfttrader.io)
   * @param orderOptions - An object that contains order options, to see available order options visit [this link](https://docs.nfttrader.io)
   * @param skip - A number representing the number of posts to skip (used for the pagination)
   * @param take - A number representing the number of posts to take (used for the pagination)
   * @param creatorAddress - A string representing the address of the wallet owner. Used to set the isCreator value to true in the case a post is created by this address
   */
  public async list(
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
   * Create a post
   *
   * @param post - A post to be created
   * @param signedMessage - A signed message by the user wallet (provide it only if the PostClient is initialized with an API key)
   */
  public async create(post: PostObject, signedMessage: string) {
    return this._createPost(post, signedMessage)
  }

  /**
   * Create a post reply
   *
   * @param reply - A reply to be created in the context of a parent post
   * @param parentId - The parent post id to whom this reply belongs to
   * @param signedMessage - A signed message by the user wallet (provide it only if the PostClient is initialized with an API key)
   */
  public async reply(reply: PostReplyObject, signedMessage: string) {
    const type: number = POST_TYPE.R1
    return this._createPost({ ...reply, type }, signedMessage)
  }

  /**
   * Delete a post by its id
   *
   * @param id - The id of the post to delete
   * @param signedMessage - A signed message by the user wallet (provide it only if the PostClient is initialized with an API key)
   */
  public async delete(
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
   * Override the basic configurations of this client
   *
   * @param config
   */
  public config(config: PostClientConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
  }

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
}
