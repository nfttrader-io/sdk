import { Maybe } from "@src/types"
import { HTTPRequestInit, HTTPResponse } from "../interfaces/base"
import { Account } from "./app"

/**
 * Class representing an HTTP client for making HTTP requests.
 * @class HTTPClient
 */
export class HTTPClient {
  private _devMode: "development" | "production" = "production"

  /**
   * @type {Maybe<string>} _apiKey - The API key, which may be null.
   */
  protected _apiKey: Maybe<string> = null

  /**
   * @type {Maybe<string>} _authToken - The JWT token, which may be null.
   */

  protected _authToken: Maybe<string> = null

  protected _account: Maybe<Account> = null

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
        const response = responseText.length ? JSON.parse(responseText) : null

        if (statusCode >= 400)
          reject({
            statusCode,
            statusMessage,
            response,
          })
        else
          resolve({
            statusCode,
            statusMessage,
            response,
          })
      })

      req.addEventListener("error", (error) =>
        reject({
          statusCode: req.status,
          statusMessage: req.statusText,
          response: error,
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
              response: error,
            })
          )

          response.on("end", () => {
            const response = result.length ? JSON.parse(result) : null

            if (statusCode >= 400)
              reject({
                statusCode,
                statusMessage,
                response,
              })
            else
              resolve({
                statusCode,
                statusMessage,
                response,
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

  protected getDevMode(): string {
    return this._devMode
  }

  protected toggleDevMode() {
    this._devMode =
      this._devMode === "development" ? "production" : "development"
  }

  protected isDevelopment() {
    return this._devMode === "development"
  }

  protected isProduction() {
    return this._devMode === "production"
  }

  protected backendUrl(): string {
    return `https://${
      this._devMode === "development" ? `develop.api.` : `api.`
    }nfttrader.io`
  }

  protected backendChatUrl(): string {
    return `${
      this._devMode === "development"
        ? `url server chat graphql development`
        : `url server chat graphql production`
    }`
  }

  protected backendChatRealtimeUrl(): string {
    return `${
      this._devMode === "development"
        ? `url server chat graphql development`
        : `url server chat graphql production`
    }`
  }

  setAuthToken(authToken: string): void {
    this._authToken = authToken
  }

  setCurrentAccount(account: Account) {
    this._account = account
  }

  getCurrentAccount() {
    return this._account
  }
}
