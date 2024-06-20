import { HTTPClient } from "./core/httpclient"
import {
  AuthClientConfig,
  AuthConfig,
  Account,
  Credentials,
} from "./types/auth"
import { AuthMode } from "./enums/auth"
import {
  IsUserRegisteredResponse,
  SigninResponse,
  SignupResponse,
} from "./interfaces/auth"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { IndexedDBStorage, RealmStorage } from "./core/app"
import { CLIENT_STORE_NAME_LOCAL_KEYS } from "./constants/app"
import { HTTPRequestInit, HTTPResponse } from "./interfaces"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 * @class Auth
 * @extends HTTPClient
 */
export class Auth extends HTTPClient {
  /**
   * @property {Maybe<string>} _authMode - The authentication mode.
   */
  private _authMode: Maybe<string> = null
  /**
   * @property {Maybe<string>} _serviceName - The name of the service.
   */
  private _serviceName: Maybe<string> = null
  /**
   * @property {Maybe<string>} _serviceTOSURL - The Terms of Service URL for the service.
   */
  private _serviceTOSURL: Maybe<string> = null
  /**
   * @property {Maybe<string>} _servicePrivacyURL - The Privacy Policy URL for the service.
   */
  private _servicePrivacyURL: Maybe<string> = null
  /**
   *  @property {Maybe<string>} _nonce - The nonce for authentication.
   */
  private _nonce: Maybe<string> = null
  /**
   * @property {string} _BACKEND_URL - The backend URL for the service.
   */
  private _BACKEND_URL: string = "https://api.nfttrader.io" //DO NOT EDIT THIS, use .config() instead
  /**
   * @property {string} _messageToSign - The message to sign for authentication.
   */
  private _messageToSign = `Welcome to {serviceName}!\n\nClick to sign in and accept the {serviceName} Terms of Service: {tosURL}\n\nand the Privacy Policy: {privacyURL}\n\nYour nonce is: {nonce}`

  private _storage: Maybe<IndexedDBStorage | RealmStorage> = null

  private _apiKey: Maybe<string> = null

  /**
   * Constructs a new instance of Auth with the provided configuration.
   * @param {AuthConfig} config - The configuration object for authentication.
   * @returns None
   */
  constructor(config: AuthConfig & ApiKeyAuthorized) {
    super()
    this._authMode = config.mode
    this._serviceName = config.serviceName
    this._servicePrivacyURL = config.servicePrivacyURL
    this._serviceTOSURL = config.serviceTOSURL
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

  /**
   * 
   * 
   * a) Generates a pair of public and private keys K(pub) and K(priv).
     b) Generates an encryption key and a secret (Y and S).
     c) Using the encryption key Y, the client encrypts the private key K(priv) and obtains YK(priv).
     d) The encryption key Y is encrypted with the secret S, yielding Y(S), and saved in the DB.
     e) The secret S is then encrypted with Y(S). From Y(S) we calculate a hash called H. From H we encrypt S. resulting in H(S). We store H on the DB.
     f) K(pub), YK(priv) and H(S) are sent to the server and stored in the database.
   * 
   */

  private async _generateKeys(): Promise<
    Maybe<{
      local: {
        KpubPem: string
        YS: string
        HString: string
      }
      server: {
        KpubPem: string
        YKPriv: string
        HS: string
      }
    }>
  > {
    let keyPair = await Crypto.generateKeys("HIGH")

    if (keyPair) {
      let KpubPem: Maybe<string> = Crypto.convertRSAPublicKeyToPem(
        keyPair.publicKey
      )
      let KprivPem: Maybe<string> = Crypto.convertRSAPrivateKeyToPem(
        keyPair.privateKey
      )
      keyPair = null

      //b)
      let Y: Maybe<{ base64YKey: string; base64YIV: string }> = {
        base64YKey: Crypto.generateBase64Key_AES256(),
        base64YIV: Crypto.generateBase64IV_128Bit(),
      }
      let S: Maybe<{ base64SKey: string; base64SIV: string }> = {
        base64SKey: Crypto.generateBase64Key_AES256(),
        base64SIV: Crypto.generateBase64IV_128Bit(),
      }

      //c)
      let YKPriv = Crypto.encryptAES_CBC(KprivPem, Y.base64YKey, Y.base64YIV)
      KprivPem = null

      //d)
      let YString: Maybe<string> = JSON.stringify(Y)
      Y = null
      let YS = Crypto.encryptAES_CBC(YString, S.base64SKey, S.base64SIV)
      YString = null

      //e)
      let SString = JSON.stringify(S)
      S = null
      let H: Maybe<{ HKey: string; base64HIV: string }> = {
        HKey: Crypto.generateSHA256Hash(YS),
        base64HIV: Crypto.generateBase64IV_128Bit(),
      }
      let HS = Crypto.encryptSHA256_IV(SString, H.HKey, H.base64HIV)
      let HString = JSON.stringify(H)
      H = null

      return {
        local: {
          KpubPem,
          YS,
          HString,
        },
        server: {
          KpubPem,
          YKPriv,
          HS,
        },
      }
    }

    return null
  }

  private async _handleIndexedDB(): Promise<{
    KpubPem: string
    YKPriv: string
    HS: string
  }> {
    const storage = this._storage as IndexedDBStorage
    try {
      await storage.createStoreIfNotExists(CLIENT_STORE_NAME_LOCAL_KEYS)
      let keys = await this._generateKeys()
      if (!keys) throw new Error("Keys generation error.")
      await storage.setItem(
        CLIENT_STORE_NAME_LOCAL_KEYS,
        "KpubPem",
        keys.local.KpubPem
      )
      await storage.setItem(CLIENT_STORE_NAME_LOCAL_KEYS, "YS", keys.local.YS)
      await storage.setItem(
        CLIENT_STORE_NAME_LOCAL_KEYS,
        "HString",
        keys.local.HString
      )

      return {
        ...keys.server,
      }
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private async _handleRealm(): Promise<{
    KpubPem: string
    YKPriv: string
    HS: string
  }> {
    let keys = await this._generateKeys()
    if (!keys) throw new Error("Keys generation error.")

    return {
      ...keys.server,
    }
  }

  /**
   * Updates the configuration settings for the authentication client.
   * @param {AuthClientConfig} config - The configuration object containing the settings to update.
   * @returns None
   */
  config(config: AuthClientConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
    if (config.mode) this._authMode = config.mode
    if (config.serviceName) this._serviceName = config.serviceName
    if (config.serviceTOSURL) this._serviceTOSURL = config.serviceTOSURL
    if (config.servicePrivacyURL)
      this._servicePrivacyURL = config.servicePrivacyURL
    if (config.storage) this._storage = config.storage
  }

  /**
   * Checks if a user is registered based on the provided credentials.
   * @param {Credentials} credentials - The user's credentials (address, email).
   * @returns {Promise<boolean>} A promise that resolves to true if the user is registered, false otherwise.
   * @throws {Error} An error is thrown if the authentication mode is not defined or if required credentials are missing.
   */
  async isUserRegistered(credentials: Credentials): Promise<boolean> {
    if (!this._authMode) throw new Error("An auth mode must be defined.")

    if (AuthMode.WALLET === this._authMode && !credentials.address)
      throw new Error(
        "Auth mode is setup to WALLET. An address must be provided."
      )

    if (AuthMode.MAGIC_LINK === this._authMode && !credentials.email)
      throw new Error(
        "Auth mode is setup to MAGIC_LINK. An email must be provided."
      )

    try {
      const body = {
        address:
          this._authMode === AuthMode.WALLET ? credentials.address : undefined,
        email:
          this._authMode === AuthMode.MAGIC_LINK
            ? credentials.email
            : undefined,
      }

      const response = await this._fetchWithAuth<IsUserRegisteredResponse>(
        `${this._BACKEND_URL}/auth/userNonce`,
        {
          method: "POST",
          body,
        }
      )
      if (
        !response.data ||
        !response.data.data ||
        response.data.data[0] === void 0
      )
        return false

      const nonce = response.data.data[0].nonce
      if (nonce) {
        this._nonce = nonce
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  /**
   * Sign up a user with the provided credentials based on the authentication mode set.
   * @param {Credentials} credentials - The user's credentials for signing up.
   * @returns {Promise<boolean>} A promise that resolves to true if the signup is successful, false otherwise.
   * @throws {Error} An error is thrown if the authentication mode is not defined, or if required credentials are missing based on the authentication mode.
   */
  async signup(credentials: Credentials): Promise<boolean> {
    if (!this._authMode) throw new Error("An auth mode must be defined.")
    if (!this._storage) throw new Error("A storage must be defined.")

    if (AuthMode.WALLET === this._authMode && !credentials.address)
      throw new Error(
        "Auth mode is setup to WALLET. An address must be provided."
      )

    if (AuthMode.MAGIC_LINK === this._authMode && !credentials.email)
      throw new Error(
        "Auth mode is setup to MAGIC_LINK. An email must be provided."
      )

    const body: {
      address?: Maybe<string>
      email?: Maybe<string>
      KpubPem: Maybe<string>
      YKPriv: Maybe<string>
      HS: Maybe<string>
    } = {
      address:
        this._authMode === AuthMode.WALLET ? credentials.address : undefined,
      email:
        this._authMode === AuthMode.MAGIC_LINK ? credentials.email : undefined,
      KpubPem: null,
      YKPriv: null,
      HS: null,
    }

    if (this._storage.typeOf() === "IndexedDBStorage") {
      let { KpubPem, YKPriv, HS } = await this._handleIndexedDB()

      body.KpubPem = KpubPem
      body.YKPriv = YKPriv
      body.HS = HS
    } else if (this._storage.typeOf() === "RealmStorage")
      await this._handleRealm()

    try {
      const response = await this._fetchWithAuth<SignupResponse>(
        `${this._BACKEND_URL}/auth/userSignup`,
        {
          method: "POST",
          body,
        }
      )
      if (
        !response.data ||
        !response.data.data ||
        response.data.data[0] === void 0
      )
        return false

      const nonce = response.data.data[0].nonce
      this._nonce = nonce
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Sign in a user with the provided credentials and signature.
   * @param {Credentials} credentials - The user's credentials for authentication.
   * @param {string} [signature] - The signature for authentication (optional).
   * @returns {Promise<Account | boolean>} A promise that resolves to the user object if sign in is successful,
   * or false if sign in fails.
   * @throws {Error} An error is thrown if the authentication mode is not defined, or if required credentials are missing based on the authentication mode.
   */
  async signin(
    credentials: Credentials,
    signature?: string
  ): Promise<Account | boolean> {
    if (!this._authMode) throw new Error("An auth mode must be defined.")

    if (
      AuthMode.WALLET === this._authMode &&
      (!credentials.address || !signature)
    )
      throw new Error(
        "Auth mode is setup to WALLET. An address and a signature must be provided."
      )

    if (AuthMode.MAGIC_LINK === this._authMode && !credentials.email)
      throw new Error(
        "Auth mode is setup to MAGIC_LINK. An email must be provided."
      )

    try {
      const body = {
        address:
          this._authMode === AuthMode.WALLET ? credentials.address : undefined,
        signature: this._authMode === AuthMode.WALLET ? signature : undefined,
        email:
          this._authMode === AuthMode.MAGIC_LINK
            ? credentials.email
            : undefined,
        serviceName:
          this._authMode === AuthMode.WALLET ? this._serviceName : undefined,
        serviceTOSURL:
          this._authMode === AuthMode.WALLET ? this._serviceTOSURL : undefined,
        servicePrivacyURL:
          this._authMode === AuthMode.WALLET
            ? this._servicePrivacyURL
            : undefined,
      }

      const response = await this._fetchWithAuth<SigninResponse>(
        `${this._BACKEND_URL}/auth/userSignin`,
        {
          method: "POST",
          body,
        }
      )
      if (
        !response.data ||
        !response.data.data ||
        response.data.data[0] === void 0
      )
        return false

      const user: Account = response.data.data[0]

      return user
    } catch (error) {
      return false
    }
  }

  /**
   * Gets the message to sign by replacing placeholders in the message template with actual values.
   * Throws an error if any required information is missing.
   * @returns The message to sign with placeholders replaced by actual values.
   */
  getMessageToSign(): string {
    if (!this._serviceName) throw new Error("A service name must be provided.")
    if (!this._serviceTOSURL)
      throw new Error("A service Terms of Service URL must be provided.")
    if (!this._servicePrivacyURL)
      throw new Error("A service Privacy Policy URL must be provided.")
    if (!this._nonce)
      throw new Error(
        "A nonce must be calculated in order to get the message to sign."
      )

    return this._messageToSign
      .split("{serviceName}")
      .join(this._serviceName)
      .split("{tosURL}")
      .join(this._serviceTOSURL)
      .split("{privacyURL}")
      .join(this._servicePrivacyURL)
      .replace("{nonce}", this._nonce)
  }
}
