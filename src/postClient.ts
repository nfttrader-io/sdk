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

export default class PostClient extends GlobalFetch {
  private _apiKey: Maybe<string> = null

  public static get POST_STATUS(): PostStatus {
    return { ...POST_STATUS }
  }

  public static get POST_TYPE(): PostType {
    return { ...POST_TYPE }
  }

  // TODO? Should apiKey be in general constructor or PostClient specific
  constructor(config?: { apiKey: string }) {
    super()
    this._apiKey = config?.apiKey ?? null
  }

  // TODO - Change Bearer in ApiKey
  private _fetchWithAuth<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    }
  ): Promise<HTTPResponse<ReturnType>> {
    if (this._apiKey)
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${this._apiKey}`,
      }

    return this._fetch(url, options)
  }

  /**
   * Get a post by its id
   *
   * @param id - The id of the post
   */
  public async getPost(id: string): Promise<Maybe<PostResponse>> {
    if (!id) throw new Error('Invalid parameter "id"')

    try {
      const { data } = await this._fetchWithAuth<PostResponse>(
        `https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/${id}`
      )

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * List posts
   */
  public async listPosts(): Promise<ListPostsResponse>
  /**
   * List posts that match the filter object
   *
   * @param filters - An object that contains filter options, to see available filter options visit [this link](https://www.google.com)
   */
  public async listPosts(filters: ListPostsFilters): Promise<ListPostsResponse>
  /**
   * List posts and order the list
   *
   * @param order - An object that contains order options, to see available order options visit [this link](https://www.google.com)
   */
  public async listPosts(order: ListPostsOrder): Promise<ListPostsResponse>
  /**
   * List `next` posts page in the list
   *
   * @param next - A string to include to fetch the next page of posts list
   */
  public async listPosts(next: string): Promise<ListPostsResponse>
  /**
   * Lists posts filtered by `filter` and orders the list based on `order`
   *
   * @param filters - An object that contains filter options, to see available filter options visit [this link](https://www.google.com)
   * @param order - An object that contains order options, to see available order options visit [this link](https://www.google.com)
   */
  public async listPosts(
    filters: ListPostsFilters,
    order: ListPostsOrder
  ): Promise<ListPostsResponse>
  /**
   * Lists posts filtered by `filter` and orders the list based on `order`
   *
   * @param filters - An object that contains filter options, to see available filter options visit [this link](https://www.google.com)
   * @param next - A string to include to fetch the next page of posts list
   */
  public async listPosts(
    filters: ListPostsFilters,
    next: string
  ): Promise<ListPostsResponse>
  /**
   * Lists posts filtered by `filter` and orders the list based on `order`
   *
   * @param filters - An object that contains filter options, to see available filter options visit [this link](https://www.google.com)
   * @param order - An object that contains order options, to see available order options visit [this link](https://www.google.com)
   * @param next - A string to include to fetch the next page of posts list
   */
  public async listPosts(
    filters: ListPostsFilters,
    order: ListPostsOrder,
    next: string
  ): Promise<ListPostsResponse>

  public async listPosts(
    filtersOrOrderOptionsOrNextKey?: Maybe<
      ListPostsFilters | ListPostsOrder | string
    >,
    orderOptionsOrNextKey?: Maybe<ListPostsOrder | string>,
    nextKey?: string | null
  ): Promise<ListPostsResponse> {
    const filtersInput =
      filtersOrOrderOptionsOrNextKey &&
      typeof filtersOrOrderOptionsOrNextKey !== "string" &&
      !("field" in filtersOrOrderOptionsOrNextKey) &&
      !("direction" in filtersOrOrderOptionsOrNextKey)
        ? { ...filtersOrOrderOptionsOrNextKey }
        : null

    let filters = null
    if (filtersInput) {
      try {
        validateListPostsFilters(filtersInput)
      } catch (e) {
        throw e
      }
      const { collections, status, type, deals } = filtersInput
      delete filtersInput.collections
      delete filtersInput.status
      delete filtersInput.type
      delete filtersInput.deals

      const collectionsWanted = collections
        ? typeof collections === "string"
          ? [collections]
          : Array.isArray(collections)
          ? [...collections]
          : collections.wanted
          ? typeof collections.wanted === "string"
            ? [collections.wanted]
            : [...collections.wanted]
          : undefined
        : undefined
      const collectionsOffered = collections
        ? typeof collections === "string"
          ? [collections]
          : Array.isArray(collections)
          ? [...collections]
          : collections.offered
          ? typeof collections.offered === "string"
            ? [collections.offered]
            : [...collections.offered]
          : undefined
        : undefined

      if (collectionsWanted) filters = { ...(filters ?? {}), collectionsWanted }
      if (collectionsOffered)
        filters = { ...(filters ?? {}), collectionsOffered }
      if (status)
        filters = {
          ...(filters ?? {}),
          status:
            typeof status === "string"
              ? PostClient.POST_STATUS[status]
              : status,
        }
      if (type)
        filters = {
          ...(filters ?? {}),
          type: typeof type === "string" ? PostClient.POST_TYPE[type] : type,
        }

      if (deals) filters = { ...(filters ?? {}), deals }

      filters = Object.fromEntries(
        Object.entries({ ...(filters ?? {}), ...filtersInput }).filter(
          ([_name, value]) => value !== undefined && value !== null
        )
      )
    }

    const order =
      orderOptionsOrNextKey && typeof orderOptionsOrNextKey !== "string"
        ? { ...orderOptionsOrNextKey }
        : filtersOrOrderOptionsOrNextKey &&
          typeof filtersOrOrderOptionsOrNextKey !== "string" &&
          ("field" in filtersOrOrderOptionsOrNextKey ||
            "direction" in filtersOrOrderOptionsOrNextKey)
        ? { ...filtersOrOrderOptionsOrNextKey }
        : null

    const next =
      typeof filtersOrOrderOptionsOrNextKey === "string"
        ? filtersOrOrderOptionsOrNextKey
        : typeof orderOptionsOrNextKey === "string"
        ? orderOptionsOrNextKey
        : nextKey
        ? nextKey
        : null

    const body = {
      filters: filters ? (Object.keys(filters).length ? filters : null) : null,
      order,
      next,
    }

    try {
      const { data } = await this._fetchWithAuth<ListPostsResponse>(
        "https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/posts",
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

  private async _createPost<
    P extends (CreatePost | CreatePostReply) & Partial<Pick<Post, "parentId">>
  >(post: P): Promise<Maybe<string>> {
    try {
      const res = await this._fetchWithAuth<string>(
        "https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/insert",
        {
          method: "POST",
          body: post,
        }
      )

      console.log(res)

      return res.data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Create a post
   *
   * @param post - A post to be created
   */
  public async createPost(post: CreatePost) {
    return this._createPost(post)
  }

  /**
   * Create a post reply
   *
   * @param reply - A reply to be created in the context of a parent post
   * @param parentId - The parent post id to whom this reply belongs to
   */
  public async createPostReply(reply: CreatePostReply, parentId: string) {
    return this._createPost({ ...reply, parentId })
  }

  /**
   * Bulk create posts
   *
   * ? POST - https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/insert
   * @param posts - An array of posts to be created
   */
  public async bulkCreatePosts(posts: Array<{}>): Promise<Array<string>> {
    return ["id1", "id2"]
  }

  /**
   * Delete a post by its id
   *
   * DELETE - https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/{postid}/delete
   * @param id - The id of the post to delete
   */
  public async deletePost(id: string): Promise<{}> {
    return {
      // post object
    }
  }

  /**
   * Delete posts by their id
   *
   * POST -
   * @param ids - The ids of the posts to delete
   */
  public async bulkDeletePosts(ids: Array<string>): Promise<Array<{}>> {
    return [
      {
        // post object
      },
      {
        // post object
      },
    ]
  }
}
