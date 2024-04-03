import HTTPClient from "./lib/httpClient"
import { AuthClientConfig } from "./types/auth/authClientConfig"
import { AuthConfig } from "./types/auth/authConfig"
import AuthMode from "./types/auth/authMode"
import { Credentials } from "./types/auth/credentials"
import IsUserRegisteredResponse from "./types/auth/isUserRegisteredResponse"
import SigninResponse from "./types/auth/signinResponse"
import SignupResponse from "./types/auth/signupResponse"
import { User } from "./types/auth/user"
import Maybe from "./types/general/maybe"

export default class Auth extends HTTPClient {
  private _authMode: Maybe<string> = null
  private _serviceName: Maybe<string> = null
  private _serviceTOSURL: Maybe<string> = null
  private _servicePrivacyURL: Maybe<string> = null
  private _nonce: Maybe<string> = null
  private _BACKEND_URL: string = "https://api.nfttrader.io" //DO NOT EDIT THIS, use .config() instead
  private _messageToSign = `Welcome to {serviceName}!\n\nClick to sign in and accept the {serviceName} Terms of Service: {tosURL}\n\nand the Privacy Policy: {privacyURL}\n\nYour nonce is: {nonce}`
  private _publicKey: string | null = null
  private _privateKey: string | null = null

  constructor(config: AuthConfig) {
    super()
    this._authMode = config.mode
    this._serviceName = config.serviceName
    this._servicePrivacyURL = config.servicePrivacyURL
    this._serviceTOSURL = config.serviceTOSURL
  }

  /**
   * Override the basic configurations of this client
   *
   * @param config
   */
  public config(config: AuthClientConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
    if (config.mode) this._authMode = config.mode
    if (config.serviceName) this._serviceName = config.serviceName
    if (config.serviceTOSURL) this._serviceTOSURL = config.serviceTOSURL
    if (config.servicePrivacyURL)
      this._servicePrivacyURL = config.servicePrivacyURL
  }

  public async isUserRegistered(credentials: Credentials): Promise<boolean> {
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

  public async signup(credentials: Credentials): Promise<boolean> {
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

  public async signin(
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
