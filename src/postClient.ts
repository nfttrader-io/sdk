import Maybe from "./types/general/maybe"
import HTTPResponse from "./types/general/httpResponse"
import HTTPRequestInit from "./types/general/httpRequestInit"
import ListPostsFilters from "./types/postClient/listPostsFilters"
import ListPostsOrder from "./types/postClient/listPostsOrder"
import ListPostsResponse from "./types/postClient/listPostsResponse"
import PostResponse from "./types/postClient/postResponse"
import CreatePost from "./types/postClient/createPost"
import CreatePostReply from "./types/postClient/createPostReply"
import PostStatus from "./types/postClient/postStatus"
import validateListPostsFilters from "./lib/postClient/validateListPostsFilters"
import PostType from "./types/postClient/postType"
import Post from "./types/postClient/post"
import POST_STATUS from "./lib/postClient/postStatus"
import POST_TYPE from "./lib/postClient/postType"
import GlobalFetch from "./lib/globalFetch"
import JWTAuthorized from "./types/postClient/jwtAuthorized"
import ApiKeyAuthorized from "./types/postClient/apiKeyAuthorized"
import PostClientConfig from "./types/postClient/postClientConfig"

export default class PostClient extends GlobalFetch {
  private _apiKey: Maybe<string> = null
  private _jwt: Maybe<string> = null
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

  constructor(config: JWTAuthorized | ApiKeyAuthorized) {
    super()
    if (`jwt` in config) this._jwt = config.jwt
    else if (`apiKey` in config) this._apiKey = config.apiKey
  }

  /**
   * Get a post by its id
   *
   * @param id - The id of the post
   */
  public async getPost(
    id: string,
    creatorAddress?: string
  ): Promise<Maybe<PostResponse>> {
    if (!id) throw new Error('Invalid parameter "id"')
    if (this._apiKey && !creatorAddress)
      console.warn(
        "If you are using an API key and you don't provide the 'creatorAddress' param, the response will contain a 'isCreator' field with a value equals to 'false'."
      )

    try {
      const { data } = await this._fetchWithAuth<PostResponse>(
        `${this._BACKEND_URL}/post/${id}` +
          `${creatorAddress ? `/${creatorAddress}` : ``}`
      )

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Get a post by its id
   *
   * @param id - The id of the post
   */
  public async getPostReplies(
    id: string,
    next?: string,
    creatorAddress?: string
  ): Promise<ListPostsResponse> {
    if (!id) throw new Error('Invalid parameter "id"')
    if (this._apiKey && !creatorAddress)
      console.warn(
        "If you are using an API key and you don't provide the 'creatorAddress' param, the response will contain a 'isCreator' field with a value equals to 'false'."
      )

    const body = {
      next,
    }

    try {
      const { data } = await this._fetchWithAuth<ListPostsResponse>(
        `${this._BACKEND_URL}/replies/${id}` +
          `${creatorAddress ? `/${creatorAddress}` : ``}`,
        {
          method: "POST",
          body,
        }
      )

      return data ?? { posts: [], next: null }
    } catch (e) {
      throw e
    }
  }

  /**
   * List posts that match the filter and order object
   *
   * @param filters - An object that contains filter options, to see available filter options visit [this link](https://www.google.com)
   * @param order - An object that contains order options, to see available order options visit [this link](https://www.google.com)
   * @param next - A string to include to fetch the next page of posts list
   */
  public async listPosts(
    filtersOptions?: ListPostsFilters,
    orderOptions?: ListPostsOrder,
    nextToken?: string
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
            typeof status === "string"
              ? PostClient.POST_STATUS[status]
              : status,
        }
      if (type || typeof type === "number")
        // type can be a number equal to zero (A1), so it's better to check typeof
        filters = {
          ...(filters ?? {}),
          type: typeof type === "string" ? PostClient.POST_TYPE[type] : type,
        }

      if (offers) filters = { ...(filters ?? {}), offers }

      filters = Object.fromEntries(
        Object.entries({ ...(filters ?? {}), ...filtersInput }).filter(
          ([_name, value]) => value !== undefined && value !== null
        )
      )
    }

    const order = orderOptions ? { ...orderOptions } : null
    const next = nextToken ? nextToken : null

    const body = {
      filters: filters ? (Object.keys(filters).length ? filters : null) : null,
      order,
      next,
    }

    try {
      const { data } = await this._fetchWithAuth<ListPostsResponse>(
        `${this._BACKEND_URL}/posts`,
        {
          method: "POST",
          body,
        }
      )

      return data ?? { posts: [], next: null }
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
  public async createPost(post: CreatePost, signedMessage?: string) {
    return this._createPost(post, signedMessage)
  }

  /**
   * Create a post reply
   *
   * @param reply - A reply to be created in the context of a parent post
   * @param parentId - The parent post id to whom this reply belongs to
   * @param signedMessage - A signed message by the user wallet (provide it only if the PostClient is initialized with an API key)
   */
  public async createPostReply(
    reply: CreatePostReply,
    parentId: string,
    signedMessage?: string
  ) {
    return this._createPost({ ...reply, parentId }, signedMessage)
  }

  /**
   * Delete a post by its id
   *
   * @param id - The id of the post to delete
   */
  public async deletePost(id: string, signedMessage?: string): Promise<void> {
    try {
      if (this._apiKey && !signedMessage)
        throw new Error("signedMessage must be provided.")

      !this._apiKey
        ? await this._fetchWithAuth(`${this._BACKEND_URL}/post/${id}/delete`, {
            method: "DELETE",
          })
        : await this._fetchWithAuth(`${this._BACKEND_URL}/post/${id}/delete`, {
            method: "DELETE",
            headers: {
              "nfttrader-signed-message": signedMessage!,
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
    this._BACKEND_URL = config.backendURL
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
      authorization: `${this._jwt ? "Bearer" : "x-api-key"} ${
        this._jwt ?? this._apiKey
      }`,
    }

    if (this._jwt) options.headers["authorizer-type"] = "token"
    else if (this._apiKey) options.headers["authorizer-type"] = "request"

    return this._fetch(url, options)
  }

  private async _createPost<
    P extends (CreatePost | CreatePostReply) & Partial<Pick<Post, "parentId">>
  >(post: P, signedMessage?: string): Promise<Maybe<string>> {
    if (this._apiKey && !signedMessage)
      throw new Error("signedMessage must be provided.")

    try {
      const res = !this._apiKey
        ? await this._fetchWithAuth<string>(
            `${this._BACKEND_URL}/post/insert`,
            {
              method: "POST",
              body: post,
            }
          )
        : await this._fetchWithAuth<string>(
            `${this._BACKEND_URL}/post/insert`,
            {
              method: "POST",
              body: post,
              headers: {
                "nfttrader-signed-message": signedMessage!,
              },
            }
          )

      return res.data ?? null
    } catch (e) {
      throw e
    }
  }
}
