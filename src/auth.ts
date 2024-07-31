import { HTTPClient } from "./core/httpclient"
import {
  AuthClientConfig,
  AuthConfig,
  AuthenticationMobileOptions,
  AuthEvents,
  AuthInfo,
  AuthParams,
  LinkAccountInfo,
} from "./types/auth"
import { ApiResponse } from "./types/base/apiresponse"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { Account, IndexedDBStorage, RealmStorage } from "./core/app"
import { CLIENT_TABLE_NAME_LOCAL_KEYS } from "./constants/app"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { AuthInternalEvents } from "./interfaces/auth/authinternalevents"
import { PrivyErrorCode } from "@src/enums/adapter/auth/privyerrorcode"
import { LoginMethod, PrivyAuthInfo } from "./types/adapter"
import { Trade } from "./trade"
import { Post } from "./post"
import { Oracle } from "./oracle"
import forge from "node-forge"
import {
  OAuthProviderType,
  PrivyApiError,
  PrivyClientError,
} from "@privy-io/expo"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 * @class Auth
 * @extends HTTPClient
 */
export class Auth extends HTTPClient implements AuthInternalEvents {
  private _storage?: IndexedDBStorage | RealmStorage
  private _privyAppId: string
  private _privyConfig?: PrivyClientConfig
  private _eventsCallbacks: Array<{
    callbacks: Function[]
    eventName: AuthEvents
  }> = []
  private _tradeRef: Maybe<Trade> = null
  private _postRef: Maybe<Post> = null
  private _oracleRef: Maybe<Oracle> = null

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

    //OAuth providers like Google, Instagram etc bring the user from the current web application page to
    //their authentication pages. When the user is redirect from their auth pages to the web application page again
    //this event is fired.
    this.on(
      "__onOAuthAuthenticatedDesktop",
      async (authInfo: PrivyAuthInfo) => {
        await this._callBackendAuthAfterOAuthRedirect(authInfo, "desktop")
      }
    )
    this.on("__onOAuthAuthenticatedMobile", async (authInfo: PrivyAuthInfo) => {
      await this._callBackendAuthAfterOAuthRedirect(authInfo, "mobile")
    })
    //OAuth providers login error handling
    this.on("__onLoginError", (error: PrivyErrorCode) => {
      this._emit("onAuthError")
    })
  }

  private async _generateKeys(): Promise<boolean | forge.pki.rsa.KeyPair> {
    const keys = await Crypto.generateKeys("HIGH")

    if (!keys) return false

    return keys
  }

  private async _handleIndexedDB(e2eSecret: string, iv: string, did: string) {
    const storage = this._storage as IndexedDBStorage
    try {
      await storage.createTableIfNotExists(CLIENT_TABLE_NAME_LOCAL_KEYS)
      const keys = await this._generateKeys()
      if (!keys || typeof keys === "boolean")
        throw new Error("Error during generation of public/private keys.")

      //save keys into db

      //let's encrypt first the private key. Private key will be always calculated runtime.
      const encryptedPrivateKey = Crypto.encryptAES_CBC(
        Crypto.convertRSAPrivateKeyToPem(keys.privateKey),
        Buffer.from(e2eSecret).toString("base64"),
        Buffer.from(iv).toString("base64")
      )
      const publicKey = Crypto.convertRSAPublicKeyToPem(keys.publicKey)

      await storage.insertSafe(
        CLIENT_TABLE_NAME_LOCAL_KEYS,
        `${did}_publicKey`,
        publicKey
      )
      await storage.insertSafe(
        CLIENT_TABLE_NAME_LOCAL_KEYS,
        `${did}_encryptedPrivateKey`,
        encryptedPrivateKey
      )
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private async _handleRealm(e2eSecret: string, iv: string, did: string) {
    let keys = await this._generateKeys()
    //if (!keys) throw new Error("Keys generation error.")

    return {
      //...keys.server,
    }
  }

  private _formatAuthParams(authInfo: PrivyAuthInfo): AuthParams {
    return {
      did: authInfo.user.id,
      walletAddress: authInfo.user.wallet!.address,
      walletConnectorType: authInfo.user.wallet!.connectorType!,
      walletImported: authInfo.user.wallet!.imported
        ? authInfo.user.wallet!.imported
        : false,
      walletRecoveryMethod: authInfo.user.wallet!.recoveryMethod
        ? authInfo.user.wallet!.recoveryMethod
        : "",
      walletClientType: authInfo.user.wallet!.walletClientType
        ? authInfo.user.wallet!.walletClientType
        : "",
      appleSubject: authInfo.user.apple ? authInfo.user.apple.subject : null,
      appleEmail: authInfo.user.apple ? authInfo.user.apple.email : null,
      discordSubject: authInfo.user.discord
        ? authInfo.user.discord.subject
        : null,
      discordEmail: authInfo.user.discord ? authInfo.user.discord.email : null,
      discordUsername: authInfo.user.discord
        ? authInfo.user.discord.username
        : null,
      farcasterFid: authInfo.user.farcaster
        ? authInfo.user.farcaster.fid
        : null,
      farcasterDisplayName: authInfo.user.farcaster
        ? authInfo.user.farcaster.displayName
        : null,
      farcasterOwnerAddress: authInfo.user.farcaster
        ? authInfo.user.farcaster.ownerAddress
        : null,
      farcasterPfp: authInfo.user.farcaster
        ? authInfo.user.farcaster.pfp
        : null,
      farcasterSignerPublicKey: authInfo.user.farcaster
        ? authInfo.user.farcaster.signerPublicKey
        : null,
      farcasterUrl: authInfo.user.farcaster
        ? authInfo.user.farcaster.url
        : null,
      farcasterUsername: authInfo.user.farcaster
        ? authInfo.user.farcaster.username
        : null,
      githubSubject: authInfo.user.github ? authInfo.user.github.subject : null,
      githubEmail: authInfo.user.github ? authInfo.user.github.email : null,
      githubName: authInfo.user.github ? authInfo.user.github.name : null,
      githubUsername: authInfo.user.github
        ? authInfo.user.github.username
        : null,
      googleEmail: authInfo.user.google ? authInfo.user.google.email : null,
      googleName: authInfo.user.google ? authInfo.user.google.name : null,
      googleSubject: authInfo.user.google ? authInfo.user.google.subject : null,
      instagramSubject: authInfo.user.instagram
        ? authInfo.user.instagram.subject
        : null,
      instagramUsername: authInfo.user.instagram
        ? authInfo.user.instagram.username
        : null,
      linkedinEmail: authInfo.user.linkedin
        ? authInfo.user.linkedin.email
        : null,
      linkedinName: authInfo.user.linkedin ? authInfo.user.linkedin.name : null,
      linkedinSubject: authInfo.user.linkedin
        ? authInfo.user.linkedin.subject
        : null,
      linkedinVanityName: authInfo.user.linkedin
        ? authInfo.user.linkedin.vanityName
        : null,
      spotifyEmail: authInfo.user.spotify ? authInfo.user.spotify.email : null,
      spotifyName: authInfo.user.spotify ? authInfo.user.spotify.name : null,
      spotifySubject: authInfo.user.spotify
        ? authInfo.user.spotify.subject
        : null,
      telegramFirstName: authInfo.user.telegram
        ? authInfo.user.telegram.firstName
        : null,
      telegramLastName: authInfo.user.telegram
        ? authInfo.user.telegram.lastName
        : null,
      telegramPhotoUrl: authInfo.user.telegram
        ? authInfo.user.telegram.photoUrl
        : null,
      telegramUserId: authInfo.user.telegram
        ? authInfo.user.telegram.telegramUserId
        : null,
      telegramUsername: authInfo.user.telegram
        ? authInfo.user.telegram.username
        : null,
      tiktokName: authInfo.user.tiktok ? authInfo.user.tiktok.name : null,
      tiktokSubject: authInfo.user.tiktok ? authInfo.user.tiktok.subject : null,
      tiktokUsername: authInfo.user.tiktok
        ? authInfo.user.tiktok.username
        : null,
      twitterName: authInfo.user.twitter ? authInfo.user.twitter.name : null,
      twitterSubject: authInfo.user.twitter
        ? authInfo.user.twitter.subject
        : null,
      twitterProfilePictureUrl: authInfo.user.twitter
        ? authInfo.user.twitter.profilePictureUrl
        : null,
      twitterUsername: authInfo.user.twitter
        ? authInfo.user.twitter.username
        : null,
      phone: authInfo.user.phone ? authInfo.user.phone.number : null,
      email: authInfo.user.email ? authInfo.user.email.address : null,
    }
  }

  private async _callBackendAuthAfterOAuthRedirect(
    authInfo: PrivyAuthInfo,
    device: "desktop" | "mobile"
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          auth: {
            token: { secret: string; iv: string } | boolean
            status: string
            did: string
          }
        }>
      >(`${this.backendUrl()}/auth`, {
        method: "POST",
        body: {
          ...this._formatAuthParams(authInfo),
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${authInfo.authToken}`,
        },
      })

      if (!response || !response.data)
        return this._emit(
          "onAuthError",
          new Error("No response from backend during authentication")
        )

      const { auth } = response.data[0]
      const { token, did } = auth

      if (!token || typeof token === "boolean")
        return this._emit("onAuthError", new Error("Access not granted."))

      this._tradeRef?.setAuthToken(authInfo.authToken)
      this._oracleRef?.setAuthToken(authInfo.authToken)
      this._postRef?.setAuthToken(authInfo.authToken)

      //generation of the table and local keys for e2e encryption
      if (device === "desktop")
        await this._handleIndexedDB(token.secret, token.iv, did)
      else if (device === "mobile")
        await this._handleRealm(token.secret, token.iv, did)

      //clear all the internal callbacks connected to the authentication...
      let event:
        | "__onOAuthAuthenticatedDesktop"
        | "__onOAuthAuthenticatedMobile" =
        device === "desktop"
          ? "__onOAuthAuthenticatedDesktop"
          : "__onOAuthAuthenticatedMobile"
      this._clearEventsCallbacks([event, "__onLoginError"])

      this._emit("auth", {
        isConnected: true,
        tokenE2E: {
          e2eSecret: token.secret,
          e2eSecretIV: token.iv,
        },
        ...authInfo,
      })
    } catch (error) {
      this._emit("onAuthError", error)
    }
  }

  private async _callBackendAuth(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void,
    authInfo: PrivyAuthInfo,
    device: "desktop" | "mobile"
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          auth: {
            token: { secret: string; iv: string } | boolean
            status: string
            did: string
          }
        }>
      >(`${this.backendUrl()}/auth`, {
        method: "POST",
        body: {
          ...this._formatAuthParams(authInfo),
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${authInfo.authToken}`,
        },
      })

      if (!response || !response.data) return reject("Invalid response.")

      const { auth } = response.data[0]
      const { token, did } = auth

      if (!token || typeof token === "boolean")
        return reject("Access not granted")

      this._tradeRef?.setAuthToken(authInfo.authToken)
      this._oracleRef?.setAuthToken(authInfo.authToken)
      this._postRef?.setAuthToken(authInfo.authToken)

      //generation of the table and local keys for e2e encryption
      if (device === "desktop")
        await this._handleIndexedDB(token.secret, token.iv, did)
      else if (device === "mobile")
        await this._handleRealm(token.secret, token.iv, did)

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])

      resolve({
        isConnected: true,
        tokenE2E: {
          e2eSecret: token.secret,
          e2eSecretIV: token.iv,
        },
        ...authInfo,
      })
    } catch (error) {
      reject(error)
    }
  }

  private _handleDesktopAuthentication(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendAuth(resolve, reject, authInfo, "desktop")
      })

      this.on("__onLoginError", (error: PrivyErrorCode) => {
        reject(error)
      })

      this._emit("__authenticate")
    } catch (error) {
      reject(error)
    }
  }

  private _clearEventsCallbacks(events: Array<AuthEvents>) {
    events.forEach((event: AuthEvents) => {
      const index = this._eventsCallbacks.findIndex((item) => {
        return item.eventName === event
      })

      if (index > -1) this._eventsCallbacks[index].callbacks = []
    })
  }

  private _handleMobileAuthenticationSMS(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void,
    { phone, OTP }: { phone: string; OTP: string }
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendAuth(resolve, reject, authInfo, "mobile")
      })

      this.on(
        "__onLoginError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__authenticateMobileSMS", { phone, OTP })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileAuthenticationEmail(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void,
    { email, OTP }: { email: string; OTP: string }
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendAuth(resolve, reject, authInfo, "mobile")
      })

      this.on(
        "__onLoginError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__authenticateMobileEmail", { email, OTP })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileAuthenticationOAuth(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void,
    { provider }: { provider: Omit<OAuthProviderType, "farcaster"> }
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendAuth(resolve, reject, authInfo, "mobile")
      })

      this.on(
        "__onLoginError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__authenticateMobileOAuth", { provider })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileAuthenticationWallet(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void,
    wallet: "metamask"
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendAuth(resolve, reject, authInfo, "mobile")
      })

      this.on(
        "__onLoginError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__authenticateMobileWallet", { wallet })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileAuthentication(
    resolve: (value: AuthInfo | PromiseLike<AuthInfo>) => void,
    reject: (reason?: any) => void,
    mobileOptions?: AuthenticationMobileOptions
  ) {
    if (!mobileOptions) return reject("mobileOptions arg cannot be undefined.")

    if (mobileOptions.type === "email") {
      if (!mobileOptions.email)
        return reject(
          "mobileOptions.type is 'email' but you didn't provide an email."
        )
      if (!mobileOptions.OTPCode)
        return reject(
          "mobileOptions.type is 'email' but you didn't provide an OTP code."
        )
      this._handleMobileAuthenticationEmail(resolve, reject, {
        email: mobileOptions.email,
        OTP: mobileOptions.OTPCode,
      })
    } else if (mobileOptions.type === "sms") {
      if (!mobileOptions.phone)
        return reject(
          "mobileOptions.type is 'sms' but you didn't provide an phone number."
        )
      if (!mobileOptions.OTPCode)
        return reject(
          "mobileOptions.type is 'sms' but you didn't provide an OTP code."
        )

      this._handleMobileAuthenticationSMS(resolve, reject, {
        phone: mobileOptions.phone,
        OTP: mobileOptions.OTPCode,
      })
    } else if (mobileOptions.type === "oauth") {
      if (!mobileOptions.provider)
        return reject(
          "mobileOptions.type is 'oauth' but you didn't provide a provider."
        )
      this._handleMobileAuthenticationOAuth(resolve, reject, {
        provider: mobileOptions.provider,
      })
    } else if (mobileOptions.type === "wallet") {
      this._handleMobileAuthenticationWallet(resolve, reject, "metamask") //for now the support is only for metamask
    }
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

  on(eventName: AuthEvents, callback: Function) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index > -1) this._eventsCallbacks[index].callbacks.push(callback)

    this._eventsCallbacks.push({
      eventName,
      callbacks: [callback],
    })
  }

  authenticate(
    device?: "desktop" | "mobile",
    mobileOptions?: AuthenticationMobileOptions
  ): Promise<AuthInfo> {
    return new Promise((resolve, reject) => {
      if (device === "desktop" && typeof window === "undefined")
        throw new Error(
          "argument 'desktop' was provided but the environment is not desktop."
        )

      if (device === "desktop")
        this._handleDesktopAuthentication(resolve, reject)
      else this._handleMobileAuthentication(resolve, reject, mobileOptions)
    })
  }

  sendEmailOTPCode(email: string): Promise<{ email: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onEmailOTPCodeSent", (email: string) => {
        resolve({ email })
      })

      this.on("__onEmailOTPCodeSentError", (error: string) => {
        reject(error)
      })

      this._emit("__sendEmailOTPCode", email)
    })
  }

  sendPhoneOTPCode(phone: string): Promise<{ phone: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onSMSOTPCodeSent", (phone: string) => {
        resolve({ phone })
      })

      this.on("__onSMSOTPCodeSentError", (error: string) => {
        reject(error)
      })

      this._emit("__sendSMSOTPCode", phone)
    })
  }

  sendEmailOTPCodeAfterAuth(email: string): Promise<{ email: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onEmailOTPCodeAfterAuthSent", (email: string) => {
        resolve({ email })
      })

      this.on("__onEmailOTPCodeAfterAuthSentError", (error: string) => {
        reject(error)
      })

      this._emit("__sendEmailOTPCodeAfterAuth", email)
    })
  }

  sendPhoneOTPCodeAfterAuth(phone: string): Promise<{ phone: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onSMSOTPCodeAfterAuthSent", (phone: string) => {
        resolve({ phone })
      })

      this.on("__onSMSOTPCodeSentAfterAuthError", (error: string) => {
        reject(error)
      })

      this._emit("__sendSMSOTPCodeAfterAuth", phone)
    })
  }

  async ready() {
    return new Promise((resolve, reject) => {
      try {
        this.on("__onPrivyReady", () => {
          resolve(true)
        })
      } catch (error) {
        resolve(false)
      }
    })
  }

  async logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.on("__onLogoutComplete", (status: boolean) => {
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
        this.on("__onLinkAccountComplete", (info: LinkAccountInfo) => {
          //aggiungere await per chiamata lato server per aggiornare backend
          resolve(info)
        })

        this.on(
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
        this.on("__onUnlinkAccountComplete", (status: boolean) => {
          //aggiungere await per chiamata lato server per aggiornare backend
          resolve(status)
        })

        this.on(
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
