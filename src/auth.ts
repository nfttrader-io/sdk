import { HTTPClient } from "./core/httpclient"
import {
  AuthClientConfig,
  AuthConfig,
  AuthEvents,
  AuthInfo,
  LinkAccountInfo,
} from "./types/auth"
import { ApiResponse } from "./types/base/apiresponse"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { Account, IndexedDBStorage, RealmStorage } from "./core/app"
import { CLIENT_STORE_NAME_LOCAL_KEYS } from "./constants/app"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { AuthInternalEvents } from "./interfaces/auth/authinternalevents"
import { PrivyErrorCode } from "@src/enums/adapter/auth/privyerrorcode"
import { LoginMethod, PrivyAuthInfo } from "./types/adapter"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 * @class Auth
 * @extends HTTPClient
 */
export class Auth extends HTTPClient implements AuthInternalEvents {
  private _storage?: IndexedDBStorage | RealmStorage
  private _apiKey: string
  private _privyAppId: string
  private _privyConfig?: PrivyClientConfig
  private _eventsMap: Array<AuthEvents> = [
    "__authenticate",
    "__onLoginComplete",
    "__onLoginError",
    "__onPrivyReady",
    "__onLogoutComplete",
    "__logout",
    "__onLinkAccountComplete",
    "__onLinkAccountError",
    "__link",
  ]
  private _eventsCallbacks: Array<{
    callbacks: Function[]
    eventName: AuthEvents
  }> = []

  /**
   * Constructs a new instance of Auth with the provided configuration.
   * @param {AuthConfig} config - The configuration object for authentication.
   * @returns None
   */
  constructor(config: AuthConfig & ApiKeyAuthorized) {
    super()

    this._storage = config.storage
    this._apiKey = config.apiKey
    this._privyAppId = config.privyAppId
    this._privyConfig = config.privyConfig
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

  _on(eventName: AuthEvents, callback: Function) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index > -1) this._eventsCallbacks[index].callbacks.push(callback)

    this._eventsCallbacks.push({
      eventName,
      callbacks: [callback],
    })
  }

  _emit(eventName: AuthEvents, params?: any) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index > -1)
      this._eventsCallbacks[index].callbacks.forEach((callback) => {
        callback(params)
      })
  }

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
  async isUserRegistered() {}

  async ready() {
    return new Promise((resolve, reject) => {
      try {
        console.log("__onPrivyReady")
        this._on("__onPrivyReady", () => {
          resolve(true)
        })
      } catch (error) {
        resolve(false)
      }
    })
  }

  async authenticate(): Promise<AuthInfo> {
    return new Promise((resolve, reject) => {
      try {
        this._on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
          try {
            //da aggiungere chiamata a backend await ....
            resolve({ isConnected: true, ...authInfo })
          } catch (error) {
            reject(error)
          }
        })

        this._on("__onLoginError", (error: PrivyErrorCode) => {
          reject(error)
        })

        this._emit("__authenticate")
      } catch (error) {
        reject(error)
      }
    })
  }

  async logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this._on("__onLogoutComplete", (status: boolean) => {
          resolve(status)
        })

        this._emit("__logout")
      } catch (error) {
        console.warn(error)
        reject(false)
      }
    })
  }

  async link(
    method:
      | "apple"
      | "discord"
      | "email"
      | "farcaster"
      | "github"
      | "google"
      | "instagram"
      | "linkedin"
      | "phone"
      | "spotify"
      | "tiktok"
      | "twitter"
      | "wallet"
      | "telegram"
  ): Promise<LinkAccountInfo> {
    return new Promise((resolve, reject) => {
      try {
        this._on("__onLinkAccountComplete", (info: LinkAccountInfo) => {
          //aggiungere await per chiamata lato server per aggiornare backend
          resolve(info)
        })

        this._on(
          "__onLinkAccountError",
          ({
            error,
            details,
          }: {
            error: PrivyErrorCode
            details: { linkMethod: LoginMethod }
          }) => {
            reject({ error, details })
          }
        )

        this._emit("__link", method)
      } catch (error) {
        console.warn(error)
        reject(error)
      }
    })
  }

  async unlink(
    method:
      | "apple"
      | "discord"
      | "email"
      | "farcaster"
      | "github"
      | "google"
      | "instagram"
      | "linkedin"
      | "phone"
      | "spotify"
      | "tiktok"
      | "twitter"
      | "wallet"
      | "telegram"
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this._on("__onUnlinkAccountComplete", (status: boolean) => {
          resolve(status)
        })

        this._on(
          "__onUnlinkAccountError",
          ({ error }: { error: PrivyErrorCode }) => {
            reject({ error })
          }
        )

        this._emit("__unlink", method)
      } catch (error) {
        console.warn(error)
        reject(error)
      }
    })
  }
}
