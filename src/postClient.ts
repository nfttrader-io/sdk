import Maybe from "./types/general/maybe"
import HTTPResponse from "./types/postClient/httpResponse"
import HTTPRequestInit from "./types/postClient/httpRequestInit"
import ListPostsFilter from "./types/postClient/listPostsFilter"
import ListPostsOrder from "./types/postClient/listPostsOrder"
import ListPostsResponse from "./types/postClient/listPostsResponse"
import PostResponse from "./types/postClient/postResponse"
import CreatePost from "./types/postClient/createPost"

export default class PostClient {
  private _apiKey: Maybe<string> = null

  // TODO? Should apiKey be in general constructor or PostClient specific
  constructor(config?: { apiKey: string }) {
    this._apiKey = config?.apiKey ?? null
  }

  private async _fetchJS<RT = any>(
    url: string | URL,
    options: HTTPRequestInit
  ): Promise<HTTPResponse<RT>> {
    const req = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      req.addEventListener("load", () => {
        const {
          status: statusCode,
          statusText: statusMessage,
          responseText,
        } = req
        const data = responseText.length ? JSON.parse(responseText) : null

        if (statusCode >= 400)
          reject({
            statusCode,
            statusMessage,
            error: data,
            isFetchError: true,
          })
        else
          resolve({
            statusCode,
            statusMessage,
            data,
          })
      })

      req.addEventListener("error", error =>
        reject({
          statusCode: req.status,
          statusMessage: req.statusText,
          error,
          isFetchError: false,
        })
      )

      req.open(options.method, url)
      if (options.headers)
        for (const [name, value] of Object.entries(options.headers))
          req.setRequestHeader(name, value)
      req.send(options.body ? new URLSearchParams(options.body) : null)
    })
  }

  private async _fetchNode<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit
  ): Promise<HTTPResponse<ReturnType>> {
    const client =
      url instanceof URL
        ? url.protocol === "https:"
          ? await import("https")
          : url.protocol === "http:"
          ? await import("http")
          : null
        : /^https?(?=:)/g.test(url)
        ? url.substring(0, 5) === "https"
          ? await import("https")
          : await import("http")
        : null
    if (!client) throw new Error("Invalid url protocol")

    return new Promise((resolve, reject) => {
      const request = client.request(
        url,
        { method: options.method, headers: options.headers ?? undefined },
        response => {
          const statusCode = response.statusCode!,
            statusMessage = response.statusMessage!
          let result = ""

          response.on(
            "data",
            chunk => (result += chunk.toString ? chunk.toString() : "")
          )

          response.on("error", error =>
            reject({
              statusCode,
              statusMessage,
              error,
              isFetchError: false,
            })
          )

          response.on("end", () => {
            const data = result.length ? JSON.parse(result) : null

            if (statusCode >= 400)
              reject({
                statusCode,
                statusMessage,
                error: data,
                isFetchError: true,
              })
            else
              resolve({
                statusCode,
                statusMessage,
                data,
              })
          })
        }
      )

      if (options.body) request.write(JSON.stringify(options.body))
      request.end()
    })
  }

  // TODO - Change Bearer in ApiKey
  private _fetch<ReturnType = any>(
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

    return globalThis.document
      ? this._fetchJS<ReturnType>(url, options)
      : this._fetchNode<ReturnType>(url, options)
  }

  /**
   * Get a post by its id
   *
   * @param id - The id of the post
   */
  public async getPost(id: string): Promise<Maybe<PostResponse>> {
    if (!id) throw new Error('Invalid parameter "id"')

    try {
      const { data } = await this._fetch<PostResponse>(
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
  public async listPosts(filters: ListPostsFilter): Promise<ListPostsResponse>
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
    filters: ListPostsFilter,
    order: ListPostsOrder
  ): Promise<ListPostsResponse>
  /**
   * Lists posts filtered by `filter` and orders the list based on `order`
   *
   * @param filters - An object that contains filter options, to see available filter options visit [this link](https://www.google.com)
   * @param next - A string to include to fetch the next page of posts list
   */
  public async listPosts(
    filters: ListPostsFilter,
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
    filters: ListPostsFilter,
    order: ListPostsOrder,
    next: string
  ): Promise<ListPostsResponse>

  public async listPosts(
    filtersOrOrderOptionsOrNextKey?: Maybe<
      ListPostsFilter | ListPostsOrder | string
    >,
    orderOptionsOrNextKey?: Maybe<ListPostsOrder | string>,
    nextKey?: string | null
  ): Promise<ListPostsResponse> {
    const filtersInput =
      filtersOrOrderOptionsOrNextKey &&
      typeof filtersOrOrderOptionsOrNextKey !== "string" &&
      !("field" in filtersOrOrderOptionsOrNextKey) &&
      !("direction" in filtersOrOrderOptionsOrNextKey) &&
      Object.keys(filtersOrOrderOptionsOrNextKey).length
        ? { ...filtersOrOrderOptionsOrNextKey }
        : null

    let filters = null
    if (filtersInput) {
      const { collections } = filtersInput
      if (collections === null || collections === undefined)
        filters = { ...filtersInput }
      else if (
        (typeof collections !== "string" &&
          !Array.isArray(collections) &&
          collections.constructor &&
          collections.constructor !== new Object().constructor) ||
        (typeof collections === "string" && !collections.length) ||
        (Array.isArray(collections) &&
          (!collections.length ||
            collections.some(c => typeof c !== "string" || !c.length))) ||
        (collections.constructor === new Object().constructor &&
          (!Object.keys(collections).length ||
            Object.keys(collections).some(
              key => !["offered", "wanted"].includes(key)
            )))
      ) {
        throw new Error('invalid parameter "filter.collections"')
      } else if (
        typeof collections !== "string" &&
        !Array.isArray(collections) &&
        collections.constructor === new Object().constructor
      ) {
        if (
          (collections.offered &&
            typeof collections.offered !== "string" &&
            !Array.isArray(collections.offered)) ||
          (Array.isArray(collections.offered) &&
            collections.offered.some(o => typeof o !== "string" || !o.length))
        )
          throw new Error('invalid parameter "filter.collections.offered"')
        if (
          (collections.wanted &&
            typeof collections.wanted !== "string" &&
            !Array.isArray(collections.wanted)) ||
          (Array.isArray(collections.wanted) &&
            collections.wanted.some(w => typeof w !== "string" || !w.length))
        )
          throw new Error('invalid parameter "filter.collections.wanted"')
      }

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

    // TODO? should filters.collections be only array
    // TODO? expirationDate is in seconds, should it be parsed in milliseconds
    // TODO delete next line
    console.log("payload:", { filters, order, next })

    try {
      const { data } = await this._fetch<ListPostsResponse>(
        "https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/posts",
        {
          method: "POST",
          body: {
            filters,
            order,
            next,
          },
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
   * POST - https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/insert
   * @param post - A post to be created
   */
  private async _createPost(post: {}): Promise<string> {
    return "id"
  }

  // TODO
  public async createPost(post: CreatePost) {
    // Here to prevent unused variable error
    this._createPost
  }

  public async createPostReply(post: {}, parentId: string) {}

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
