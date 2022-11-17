import HTTPRequestInit from "./interfaces/postClient/httpRequestInit"
import ListPostsFilter from "./interfaces/postClient/listPostsFilter"
import ListPostsOrder from "./interfaces/postClient/listPostsOrder"

export default class PostClient {
  constructor() {
    if (globalThis.document) {
      // Inside client-side JS
      this.fetch = this.fetchJS
    } else {
      // Inside nodeJS
      this.fetch = this.fetchNode
    }
  }

  private async fetchJS(
    url: string | URL,
    options: HTTPRequestInit = { method: "GET", body: undefined }
  ) {
    const req = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      req.addEventListener("load", resolve)
      req.addEventListener("error", reject)

      req.open(options.method, url)
      req.send(options.body ? new URLSearchParams(options.body) : null)
    })
  }

  private async fetchNode(
    url: string | URL,
    options: HTTPRequestInit = { method: "GET", body: undefined }
  ) {
    const http = await import("http")
    // TODO finish to implement fetchNode
  }

  private fetch!: (url: string | URL, options?: HTTPRequestInit) => Promise<any>

  /**
   * Get a post by its id
   *
   * https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/{postid}
   * @param id - The id of the post
   */
  public async getPost(id: string): Promise<{}> {
    return {
      // post object
    }
  }

  /**
   * List posts that match the filter object
   *
   * https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/posts
   * @param filter - The filter object
   */
  public async listPosts(
    filterOrOrderOptions: ListPostsFilter | ListPostsOrder,
    orderOptions?: ListPostsOrder
  ): Promise<Array<{}>> {
    const filter =
      orderOptions &&
      !("field" in filterOrOrderOptions) &&
      !("direction" in filterOrOrderOptions) &&
      Object.keys(filterOrOrderOptions).length
        ? { ...filterOrOrderOptions }
        : null

    const order = orderOptions
      ? { ...orderOptions }
      : "field" in filterOrOrderOptions && "direction" in filterOrOrderOptions
      ? { ...filterOrOrderOptions }
      : null

    console.log(filter, order)
    // POST BODY { filter, order }

    // const res = await this.fetch(
    //   "https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/posts",
    //   {
    //     method: "POST",
    //     body: {},
    //   }
    // )

    return [
      {
        // post object
      },
      {
        // post object
      },
    ]
  }

  /**
   * Create a post
   *
   * https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/insert
   * @param post - A post to be created
   */
  public async createPost(post: {}): Promise<string> {
    return "id"
  }

  /**
   * Bulk create posts
   *
   * ? https://fg4fmqp559.execute-api.eu-west-1.amazonaws.com/dev/post/insert
   * @param posts - An array of posts to be created
   */
  public async bulkCreatePosts(posts: Array<{}>): Promise<Array<string>> {
    return ["id1", "id2"]
  }

  /**
   * Delete a post by its id
   *
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
