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
import { Account, DexieStorage, RealmStorage } from "./core/app"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { AuthInternalEvents } from "./interfaces/auth/authinternalevents"
import { PrivyErrorCode } from "@src/enums/adapter/auth/privyerrorcode"
import { PrivyAuthInfo } from "./types/adapter"
import { Trade } from "./trade"
import { Post } from "./post"
import { Oracle } from "./oracle"
import forge from "node-forge"
import {
  OAuthProviderType,
  PrivyApiError,
  PrivyClientError,
} from "@privy-io/expo"
import { AccountInitConfig } from "./types/auth/account"
import { Chat } from "./chat"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 * @class Auth
 * @extends HTTPClient
 */
export class Auth extends HTTPClient implements AuthInternalEvents {
  private _storage?: DexieStorage | RealmStorage
  private _privyAppId: string
  private _privyConfig?: PrivyClientConfig
  private _eventsCallbacks: Array<{
    callbacks: Function[]
    eventName: AuthEvents
  }> = []
  private _tradeRef: Trade
  private _postRef: Post
  private _oracleRef: Oracle
  private _chatRef: Chat

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
    this._tradeRef = config.trade
    this._oracleRef = config.oracle
    this._postRef = config.post
    this._chatRef = config.chat

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
    // same but for linking an account to a user already registered
    this.on(
      "__onOAuthLinkAuthenticatedDesktop",
      async (authInfo: PrivyAuthInfo) => {
        await this._callBackendLinkAfterOAuthRedirect(authInfo, "desktop")
      }
    )
    this.on(
      "__onOAuthLinkAuthenticatedMobile",
      async (authInfo: PrivyAuthInfo) => {
        await this._callBackendAuthAfterOAuthRedirect(authInfo, "mobile")
      }
    )

    //OAuth providers login error handling
    this.on("__onLoginError", (error: PrivyErrorCode) => {
      this._emit("onAuthError", error)
    })
    this.on("__onLinkAccountError", (error: PrivyErrorCode) => {
      this._emit("onLinkError", error)
    })
  }

  private async _generateKeys(): Promise<boolean | forge.pki.rsa.KeyPair> {
    const keys = await Crypto.generateKeys("HIGH")

    if (!keys) return false

    return keys
  }

  private async _handleDexie(account: Account) {
    const storage = this._storage as DexieStorage
    try {
      const keys = await this._generateKeys()
      if (!keys || typeof keys === "boolean")
        throw new Error("Error during generation of public/private keys.")

      //let's encrypt first the private key. Private key will be always calculated runtime.
      const encryptedPrivateKey = Crypto.encryptAES_CBC(
        Crypto.convertRSAPrivateKeyToPem(keys.privateKey),
        Buffer.from(account.e2eSecret).toString("base64"),
        Buffer.from(account.e2eSecretIV).toString("base64")
      )
      const publicKey = Crypto.convertRSAPublicKeyToPem(keys.publicKey)

      //save all the data related to this user into the db
      await storage.transaction("rw", storage.user, async () => {
        const existingUser = await storage.user
          .where("[did+organizationId]")
          .equals([account.did, account.organizationId])
          .first()

        if (!existingUser)
          await storage.user.add({
            did: account.did,
            organizationId: account.organizationId,
            username: account.username,
            email: account.email,
            bio: account.bio,
            avatarUrl: account.avatarUrl,
            isVerified: account.isVerified,
            isNft: account.isNft,
            wallet: {
              address: account.walletAddress,
              connectorType: account.walletConnectorType,
            },
            apple: account.appleSubject
              ? {
                  subject: account.appleSubject,
                  email: account.email,
                }
              : null,
            discord: account.discordSubject
              ? {
                  subject: account.discordSubject,
                  email: account.discordEmail,
                  username: account.username,
                }
              : null,
            farcaster: account.farcasterFid
              ? {
                  fid: account.farcasterFid,
                  displayName: account.farcasterDisplayName,
                  ownerAddress: account.farcasterOwnerAddress,
                  pfp: account.farcasterPfp,
                  username: account.farcasterUsername,
                }
              : null,
            github: account.githubSubject
              ? {
                  subject: account.githubSubject,
                  email: account.githubEmail,
                  name: account.githubName,
                  username: account.githubUsername,
                }
              : null,
            google: account.googleSubject
              ? {
                  subject: account.googleSubject,
                  email: account.googleEmail,
                  name: account.googleName,
                }
              : null,
            instagram: account.instagramSubject
              ? {
                  subject: account.instagramSubject,
                  username: account.instagramUsername,
                }
              : null,
            linkedin: account.linkedinSubject
              ? {
                  subject: account.linkedinSubject,
                  email: account.linkedinEmail,
                  name: account.linkedinName,
                  vanityName: account.linkedinVanityName,
                }
              : null,
            spotify: account.spotifySubject
              ? {
                  subject: account.spotifySubject,
                  email: account.spotifyEmail,
                  name: account.spotifyName,
                }
              : null,
            telegram: account.telegramUserId
              ? {
                  firstName: account.telegramFirstName,
                  lastName: account.telegramLastName,
                  photoUrl: account.telegramPhotoUrl,
                  userId: account.telegramUserId,
                  username: account.telegramUsername,
                }
              : null,
            tiktok: account.tiktokSubject
              ? {
                  name: account.tiktokName,
                  subject: account.tiktokSubject,
                  username: account.tiktokUsername,
                }
              : null,
            twitter: account.twitterSubject
              ? {
                  name: account.twitterName,
                  subject: account.twitterSubject,
                  profilePictureUrl: account.twitterProfilePictureUrl,
                  username: account.twitterUsername,
                }
              : null,
            allowNotification: account.allowNotification,
            allowNotificationSound: account.allowNotificationSound,
            visibility: account.visibility,
            onlineStatus: account.onlineStatus,
            allowReadReceipt: account.allowReadReceipt,
            allowReceiveMessageFrom: account.allowReceiveMessageFrom,
            allowAddToGroupsFrom: account.allowAddToGroupsFrom,
            allowGroupsSuggestion: account.allowGroupsSuggestion,
            e2ePublicKey: publicKey,
            e2eEncryptedPrivateKey: encryptedPrivateKey,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
          })
      })
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private async _handleRealm(account: Account) {
    const storage = this._storage as RealmStorage
    try {
      const keys = await this._generateKeys()
      if (!keys || typeof keys === "boolean")
        throw new Error("Error during generation of public/private keys.")

      //let's encrypt first the private key. Private key will be always calculated runtime.
      const encryptedPrivateKey = Crypto.encryptAES_CBC(
        Crypto.convertRSAPrivateKeyToPem(keys.privateKey),
        Buffer.from(account.e2eSecret).toString("base64"),
        Buffer.from(account.e2eSecretIV).toString("base64")
      )
      const publicKey = Crypto.convertRSAPublicKeyToPem(keys.publicKey)

      //save all the data related to this user into the db

      storage.query((realm, user) => {
        const existingUser = user.filtered(
          `compositeKey == '${account.did}-${account.organizationId}'`
        )

        if (!existingUser)
          realm.write(() => {
            realm.create("User", {
              did: account.did,
              organizationId: account.organizationId,
              username: account.username,
              email: account.email,
              bio: account.bio,
              avatarUrl: account.avatarUrl,
              isVerified: account.isVerified,
              isNft: account.isNft,
              wallet: {
                address: account.walletAddress,
                connectorType: account.walletConnectorType,
              },
              apple: account.appleSubject
                ? {
                    subject: account.appleSubject,
                    email: account.email,
                  }
                : null,
              discord: account.discordSubject
                ? {
                    subject: account.discordSubject,
                    email: account.discordEmail,
                    username: account.username,
                  }
                : null,
              farcaster: account.farcasterFid
                ? {
                    fid: account.farcasterFid,
                    displayName: account.farcasterDisplayName,
                    ownerAddress: account.farcasterOwnerAddress,
                    pfp: new URL(
                      account.farcasterPfp ? account.farcasterPfp : ""
                    ),
                    username: account.farcasterUsername,
                  }
                : null,
              github: account.githubSubject
                ? {
                    subject: account.githubSubject,
                    email: account.githubEmail,
                    name: account.githubName,
                    username: account.githubUsername,
                  }
                : null,
              google: account.googleSubject
                ? {
                    subject: account.googleSubject,
                    email: account.googleEmail,
                    name: account.googleName,
                  }
                : null,
              instagram: account.instagramSubject
                ? {
                    subject: account.instagramSubject,
                    username: account.instagramUsername,
                  }
                : null,
              linkedin: account.linkedinSubject
                ? {
                    subject: account.linkedinSubject,
                    email: account.linkedinEmail,
                    name: account.linkedinName,
                    vanityName: account.linkedinVanityName,
                  }
                : null,
              spotify: account.spotifySubject
                ? {
                    subject: account.spotifySubject,
                    email: account.spotifyEmail,
                    name: account.spotifyName,
                  }
                : null,
              telegram: account.telegramUserId
                ? {
                    firstName: account.telegramFirstName,
                    lastName: account.telegramLastName,
                    photoUrl: account.telegramPhotoUrl
                      ? new URL(account.telegramPhotoUrl)
                      : null,
                    userId: account.telegramUserId,
                    username: account.telegramUsername,
                  }
                : null,
              tiktok: account.tiktokSubject
                ? {
                    name: account.tiktokName,
                    subject: account.tiktokSubject,
                    username: account.tiktokUsername,
                  }
                : null,
              twitter: account.twitterSubject
                ? {
                    name: account.twitterName,
                    subject: account.twitterSubject,
                    profilePictureUrl: account.twitterProfilePictureUrl
                      ? new URL(account.twitterProfilePictureUrl)
                      : null,
                    username: account.twitterUsername,
                  }
                : null,
              allowNotification: account.allowNotification,
              allowNotificationSound: account.allowNotificationSound,
              visibility: account.visibility,
              onlineStatus: account.onlineStatus,
              allowReadReceipt: account.allowReadReceipt,
              allowReceiveMessageFrom: account.allowReceiveMessageFrom,
              allowAddToGroupsFrom: account.allowAddToGroupsFrom,
              allowGroupsSuggestion: account.allowGroupsSuggestion,
              e2ePublicKey: publicKey,
              e2eEncryptedPrivateKey: encryptedPrivateKey,
              createdAt: account.createdAt,
              updatedAt: account.updatedAt,
            })
          })
      }, "user")
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private async _callBackendAuthAfterOAuthRedirect(
    authInfo: PrivyAuthInfo,
    device: "desktop" | "mobile"
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          user: AccountInitConfig
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

      const { user } = response.data[0]

      if (!user)
        return this._emit("onAuthError", new Error("Access not granted."))

      const account = new Account(user)

      this._tradeRef.setAuthToken(authInfo.authToken)
      this._oracleRef.setAuthToken(authInfo.authToken)
      this._postRef.setAuthToken(authInfo.authToken)
      this._chatRef.setAuthToken(authInfo.authToken)

      this._chatRef.setCurrentAccount(account)
      this._tradeRef.setCurrentAccount(account)
      this._oracleRef.setCurrentAccount(account)
      this._postRef.setCurrentAccount(account)

      //generation of the table and local keys for e2e encryption
      if (device === "desktop") await this._handleDexie(account)
      else if (device === "mobile") await this._handleRealm(account)

      //clear all the internal callbacks connected to the authentication...
      let event:
        | "__onOAuthAuthenticatedDesktop"
        | "__onOAuthAuthenticatedMobile" =
        device === "desktop"
          ? "__onOAuthAuthenticatedDesktop"
          : "__onOAuthAuthenticatedMobile"
      this._clearEventsCallbacks([event, "__onLoginError"])

      this._emit("auth", {
        auth: {
          isConnected: true,
          ...authInfo,
        },
        account,
      })
    } catch (error) {
      this._emit("onAuthError", error)
    }
  }

  private async _callBackendAuth(
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
    reject: (reason?: any) => void,
    authInfo: PrivyAuthInfo,
    device: "desktop" | "mobile"
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          user: AccountInitConfig
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

      const { user } = response.data[0]

      if (!user) return reject("Access not granted")

      const account = new Account(user)

      this._tradeRef.setAuthToken(authInfo.authToken)
      this._oracleRef.setAuthToken(authInfo.authToken)
      this._postRef.setAuthToken(authInfo.authToken)
      this._chatRef.setAuthToken(authInfo.authToken)

      this._chatRef.setCurrentAccount(account)
      this._tradeRef.setCurrentAccount(account)
      this._oracleRef.setCurrentAccount(account)
      this._postRef.setCurrentAccount(account)

      //generation of the table and local keys for e2e encryption
      if (device === "desktop") await this._handleDexie(account)
      else if (device === "mobile") await this._handleRealm(account)

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])

      resolve({
        auth: {
          isConnected: true,
          ...authInfo,
        },
        account,
      })
    } catch (error) {
      reject(error)
    }
  }

  private async _callBackendLinkAfterOAuthRedirect(
    authInfo: PrivyAuthInfo,
    device: "desktop" | "mobile"
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          link: {
            status: boolean
          }
        }>
      >(`${this.backendUrl()}/linkAccount`, {
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
        return this._emit("onLinkError", new Error("Invalid response."))

      const { link } = response.data[0]
      const { status } = link

      if (!link || !status)
        return this._emit(
          "onLinkError",
          new Error("An error occured while updating the account.")
        )

      //clear all the internal callbacks connected to the authentication...
      let event:
        | "__onOAuthLinkAuthenticatedDesktop"
        | "__onOAuthLinkAuthenticatedMobile" =
        device === "desktop"
          ? "__onOAuthLinkAuthenticatedDesktop"
          : "__onOAuthLinkAuthenticatedMobile"
      this._clearEventsCallbacks([event, "__onLinkAccountError"])

      this._emit("link", {
        ...authInfo,
      })
    } catch (error) {
      this._emit("onLinkError", error)
    }
  }

  private async _callBackendLink(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    authInfo: PrivyAuthInfo
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          link: {
            status: boolean
          }
        }>
      >(`${this.backendUrl()}/linkAccount`, {
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

      const { link } = response.data[0]
      const { status } = link

      if (!link || !status)
        return reject("An error occured while updating the account.")

      //clear all the internal callbacks connected to the link...
      this._clearEventsCallbacks([
        "__onLinkAccountComplete",
        "__onLinkAccountError",
      ])

      resolve({ ...authInfo })
    } catch (error) {
      reject(error)
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

  private _clearEventsCallbacks(events: Array<AuthEvents>) {
    events.forEach((event: AuthEvents) => {
      const index = this._eventsCallbacks.findIndex((item) => {
        return item.eventName === event
      })

      if (index > -1) this._eventsCallbacks[index].callbacks = []
    })
  }

  private _handleDesktopAuthentication(
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
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

  private _handleMobileAuthentication(
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
    reject: (reason?: any) => void,
    mobileOptions?: AuthenticationMobileOptions
  ) {
    if (!mobileOptions)
      return reject("mobileOptions argument must be provided.")

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

  private _handleMobileAuthenticationSMS(
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
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
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
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
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
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
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
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

  private _handleDesktopLink(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    desktopOptions: {
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
    }
  ) {
    try {
      this.on("__onLinkAccountComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendLink(resolve, reject, authInfo)
      })

      this.on("__onLinkAccountError", (error: PrivyErrorCode) => {
        reject(error)
      })

      this._emit("__link", desktopOptions.method)
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileLinkSMS(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    { phone, OTP }: { phone: string; OTP: string }
  ) {
    try {
      this.on("__onLinkAccountComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendLink(resolve, reject, authInfo)
      })

      this.on(
        "__onLinkAccountError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__linkMobileSMS", { phone, OTP })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileLinkEmail(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    { email, OTP }: { email: string; OTP: string }
  ) {
    try {
      this.on("__onLinkAccountComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendLink(resolve, reject, authInfo)
      })

      this.on(
        "__onLinkAccountError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__linkMobileEmail", { email, OTP })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileLinkOAuth(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    { provider }: { provider: Omit<OAuthProviderType, "farcaster"> }
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendLink(resolve, reject, authInfo)
      })

      this.on(
        "__onLinkAccountError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__linkMobileOAuth", { provider })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileLinkWallet(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    wallet: "metamask"
  ) {
    try {
      this.on("__onLinkAccountComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendLink(resolve, reject, authInfo)
      })

      this.on(
        "__onLinkAccountError",
        (error: PrivyClientError | PrivyApiError | Error) => {
          reject(error)
        }
      )

      this._emit("__linkMobileWallet", { wallet })
    } catch (error) {
      reject(error)
    }
  }

  private _handleMobileLink(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    mobileOptions?: AuthenticationMobileOptions
  ) {
    if (!mobileOptions)
      return reject("mobileOptions argument must be provided.")

    if (mobileOptions.type === "email") {
      if (!mobileOptions.email)
        return reject(
          "mobileOptions.type is 'email' but you didn't provide an email."
        )
      if (!mobileOptions.OTPCode)
        return reject(
          "mobileOptions.type is 'email' but you didn't provide an OTP code."
        )
      this._handleMobileLinkEmail(resolve, reject, {
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

      this._handleMobileLinkSMS(resolve, reject, {
        phone: mobileOptions.phone,
        OTP: mobileOptions.OTPCode,
      })
    } else if (mobileOptions.type === "oauth") {
      if (!mobileOptions.provider)
        return reject(
          "mobileOptions.type is 'oauth' but you didn't provide a provider."
        )
      this._handleMobileLinkOAuth(resolve, reject, {
        provider: mobileOptions.provider,
      })
    } else if (mobileOptions.type === "wallet") {
      this._handleMobileLinkWallet(resolve, reject, "metamask") //for now the support is only for metamask
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
    mobileOptions?: AuthenticationMobileOptions
  ): Promise<{ auth: AuthInfo; account: Account }> {
    return new Promise((resolve, reject) => {
      const isDesktop = typeof window !== "undefined"

      if (isDesktop) this._handleDesktopAuthentication(resolve, reject)
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

  ready() {
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

  logout(): Promise<boolean> {
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

  link(
    desktopOptions?: {
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
    },
    mobileOptions?: AuthenticationMobileOptions
  ): Promise<LinkAccountInfo> {
    return new Promise((resolve, reject) => {
      const isDesktop = typeof window !== "undefined"

      if (isDesktop) {
        if (!desktopOptions)
          throw new Error("desktopOptions argument must be provided.")
        this._handleDesktopLink(resolve, reject, desktopOptions)
      } else {
        if (!mobileOptions)
          throw new Error("mobileOptions argument must be provided.")
        this._handleMobileLink(resolve, reject, mobileOptions)
      }
    })
  }

  unlink(
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
