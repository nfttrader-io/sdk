import { HTTPClient } from "./core/httpclient"
import { AuthClientConfig, AuthConfig, Credentials } from "./types/auth"
import { ApiResponse } from "./types/base/apiresponse"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { Account, IndexedDBStorage, RealmStorage } from "./core/app"
import { CLIENT_STORE_NAME_LOCAL_KEYS } from "./constants/app"
import { HTTPRequestInit, HTTPResponse } from "./interfaces"
import React from "react"
import ReactDOM from "react-dom"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 * @class Auth
 * @extends HTTPClient
 */
export class Auth extends HTTPClient {
  /**
   * @property {string} _BACKEND_URL - The backend URL for the service.
   */
  private _BACKEND_URL: string = "https://api.nfttrader.io" //DO NOT EDIT THIS, use .config() instead

  private _storage: Maybe<IndexedDBStorage | RealmStorage> = null

  private _apiKey: Maybe<string> = null

  /**
   * Constructs a new instance of Auth with the provided configuration.
   * @param {AuthConfig} config - The configuration object for authentication.
   * @returns None
   */
  constructor(config: AuthConfig & ApiKeyAuthorized) {
    super()
    this._storage = config.storage
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

  private async _handleIndexedDB() {
    const storage = this._storage as IndexedDBStorage
    try {
      await storage.createStoreIfNotExists(CLIENT_STORE_NAME_LOCAL_KEYS)
      //generate keys and save them into db
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private async _handleRealm() {}

  /**
   * Updates the configuration settings for the authentication client.
   * @param {AuthClientConfig} config - The configuration object containing the settings to update.
   * @returns None
   */
  config(config: AuthClientConfig) {
    if (config.storage) this._storage = config.storage
  }

  /**
   * Checks if a user is registered based on the provided credentials.
   * @param {Credentials} credentials - The user's credentials (address, email).
   * @returns {Promise<boolean>} A promise that resolves to true if the user is registered, false otherwise.
   * @throws {Error} An error is thrown if the authentication mode is not defined or if required credentials are missing.
   */
  async isUserRegistered(credentials: Credentials) {}

  /**
   * Sign up a user with the provided credentials based on the authentication mode set.
   * @param {Credentials} credentials - The user's credentials for signing up.
   * @returns {Promise<boolean>} A promise that resolves to true if the signup is successful, false otherwise.
   * @throws {Error} An error is thrown if the authentication mode is not defined, or if required credentials are missing based on the authentication mode.
   */
  async signup(credentials: Credentials) {}

  /**
   * Sign in a user with the provided credentials and signature.
   * @param {Credentials} credentials - The user's credentials for authentication.
   * @param {string} [signature] - The signature for authentication (optional).
   * @returns {Promise<Account | boolean>} A promise that resolves to the user object if sign in is successful,
   * or false if sign in fails.
   * @throws {Error} An error is thrown if the authentication mode is not defined, or if required credentials are missing based on the authentication mode.
   */
  async signin(credentials: Credentials) {}
}
