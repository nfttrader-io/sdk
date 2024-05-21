import { HTTPRequestInit, HTTPResponse } from "../interfaces/base"

/**
 * Class representing an HTTP client for making HTTP requests.
 * @class HTTPClient
 */
export class HTTPClient {
  /**
   * Fetches data from a specified URL using XMLHttpRequest.
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} options - The options for the HTTP request.
   * @returns {Promise<HTTPResponse<RT>>} A promise that resolves with the HTTP response data.
   */
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

      req.addEventListener("error", (error) =>
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
      req.send(JSON.stringify(options.body))
    })
  }

  /**
   * Fetches data from a given URL using the specified options.
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} options - The options for the HTTP request.
   * @returns {Promise<HTTPResponse<ReturnType>>} A promise that resolves with the HTTP response.
   * @throws {Error} If the URL protocol is invalid.
   */
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
        (response) => {
          const statusCode = response.statusCode!,
            statusMessage = response.statusMessage!
          let result = ""

          response.on(
            "data",
            (chunk) => (result += chunk.toString ? chunk.toString() : "")
          )

          response.on("error", (error) =>
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

  /**
   * Fetches data from the specified URL using either browser's fetch API or Node.js's http/https module.
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} [options] - The options for the HTTP request such as method, headers, and body.
   * @returns {Promise<HTTPResponse<ReturnType>>} A promise that resolves to the HTTP response.
   */
  protected _fetch<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    }
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    }

    return globalThis.document
      ? this._fetchJS<ReturnType>(url, options)
      : this._fetchNode<ReturnType>(url, options)
  }
}
