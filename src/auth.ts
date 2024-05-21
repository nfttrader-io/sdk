import { HTTPClient } from "./core/httpclient"
import { AuthClientConfig, AuthConfig, User, Credentials } from "./types/auth"
import { AuthMode } from "./enums/auth"
import {
  IsUserRegisteredResponse,
  SigninResponse,
  SignupResponse,
} from "./interfaces/auth"
import { Maybe } from "./types/base"

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
  /**
   * @property {Maybe<string>} _publicKey -
   */
  private _publicKey: Maybe<string> = null
  /**
   * @property {Maybe<string>} _privateKey -
   */
  private _privateKey: Maybe<string> = null

  /**
   * Constructs a new instance of Auth with the provided configuration.
   * @param {AuthConfig} config - The configuration object for authentication.
   * @returns None
   */
  constructor(config: AuthConfig) {
    super()
    this._authMode = config.mode
    this._serviceName = config.serviceName
    this._servicePrivacyURL = config.servicePrivacyURL
    this._serviceTOSURL = config.serviceTOSURL
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
  }

  /**
   * Checks if a user is registered based on the provided credentials.
   * @param {Credentials} credentials - The user's credentials (address, email, password).
   * @returns {Promise<boolean>} A promise that resolves to true if the user is registered, false otherwise.
   * @throws {Error} An error is thrown if the authentication mode is not defined or if required credentials are missing.
   */
  async isUserRegistered(credentials: Credentials): Promise<boolean> {
    if (!this._authMode) throw new Error("An auth mode must be defined.")

    if (AuthMode.WALLET === this._authMode && !credentials.address)
      throw new Error(
        "Auth mode is setup to WALLET. An address must be provided."
      )

    if (
      AuthMode.CREDENTIALS === this._authMode &&
      (!credentials.email || !credentials.password)
    )
      throw new Error(
        "Auth mode is setup to CREDENTIALS. An email and password must be provided."
      )

    try {
      const body = {
        address:
          this._authMode === AuthMode.WALLET ? credentials.address : undefined,
        email:
          this._authMode === AuthMode.CREDENTIALS
            ? credentials.email
            : undefined,
        password:
          this._authMode === AuthMode.CREDENTIALS
            ? credentials.password
            : undefined,
      }

      const response = await this._fetch<IsUserRegisteredResponse>(
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

    if (AuthMode.WALLET === this._authMode && !credentials.address)
      throw new Error(
        "Auth mode is setup to WALLET. An address must be provided."
      )

    if (
      AuthMode.CREDENTIALS === this._authMode &&
      (!credentials.email || !credentials.password)
    )
      throw new Error(
        "Auth mode is setup to CREDENTIALS. An email and password must be provided."
      )

    try {
      const body = {
        address:
          this._authMode === AuthMode.WALLET ? credentials.address : undefined,
        email:
          this._authMode === AuthMode.CREDENTIALS
            ? credentials.email
            : undefined,
        password:
          this._authMode === AuthMode.CREDENTIALS
            ? credentials.password
            : undefined,
      }

      const response = await this._fetch<SignupResponse>(
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
   * @returns {Promise<User | boolean>} A promise that resolves to the user object if sign in is successful,
   * or false if sign in fails.
   * @throws {Error} An error is thrown if the authentication mode is not defined, or if required credentials are missing based on the authentication mode.
   */
  async signin(
    credentials: Credentials,
    signature?: string
  ): Promise<User | boolean> {
    if (!this._authMode) throw new Error("An auth mode must be defined.")

    if (
      AuthMode.WALLET === this._authMode &&
      (!credentials.address || !signature)
    )
      throw new Error(
        "Auth mode is setup to WALLET. An address and a signature must be provided."
      )

    if (
      AuthMode.CREDENTIALS === this._authMode &&
      (!credentials.email || !credentials.password)
    )
      throw new Error(
        "Auth mode is setup to CREDENTIALS. An email and password must be provided."
      )

    try {
      const body = {
        address:
          this._authMode === AuthMode.WALLET ? credentials.address : undefined,
        signature: this._authMode === AuthMode.WALLET ? signature : undefined,
        email:
          this._authMode === AuthMode.CREDENTIALS
            ? credentials.email
            : undefined,
        password:
          this._authMode === AuthMode.CREDENTIALS
            ? credentials.password
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

      const response = await this._fetch<SigninResponse>(
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

      const user: User = response.data.data[0]

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
