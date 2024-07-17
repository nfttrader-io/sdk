import {
  AppleOAuthWithMetadata,
  CrossAppAccountWithMetadata,
  DiscordOAuthWithMetadata,
  EmailWithMetadata,
  FarcasterWithMetadata,
  GithubOAuthWithMetadata,
  GoogleOAuthWithMetadata,
  LinkedInOAuthWithMetadata,
  PasskeyWithMetadata,
  PhoneWithMetadata,
  TelegramWithMetadata,
  TiktokOAuthWithMetadata,
  TwitterOAuthWithMetadata,
  WalletWithMetadata,
} from "@privy-io/react-auth"

type LinkedAccountType =
  | "wallet"
  | "email"
  | "phone"
  | "google_oauth"
  | "twitter_oauth"
  | "discord_oauth"
  | "github_oauth"
  | "spotify_oauth"
  | "instagram_oauth"
  | "tiktok_oauth"
  | "linkedin_oauth"
  | "apple_oauth"
  | "custom_auth"
  | "farcaster"
  | "passkey"
  | "telegram"
  | "cross_app"

/** @ignore */
interface LinkMetadata {
  /** Account type, most commonly useful when filtering through linkedAccounts */
  type: LinkedAccountType
  /**
   * @deprecated use `firstVerifiedAt` instead.
   * Datetime when this account was linked to the user or created. */
  verifiedAt: Date
  /** Datetime when this account was linked to the user. */
  firstVerifiedAt: Date | null
  /** Datetime when this account was most recently used as a login/link method by the user. */
  latestVerifiedAt: Date | null
}

/** Object representation of a user's Spotify account. */
interface Spotify {
  /** The user id associated with the Spotify account. */
  subject: string
  /** The email associated with the Spotify account.  */
  email: string | null
  /** The display name associated with the Spotify account. */
  name: string | null
}

/** Object representation of a user's Instagram account. */
interface Instagram {
  /** The user id associated with the Instagram account. */
  subject: string
  /** The username associated with the Instagram account.  */
  username: string | null
}

interface CustomJwtAccount {
  /** The user ID given by the custom auth provider */
  customUserId: string
}

/** Object representation of a user's Tiktok Account, with additional metadata for advanced use cases. */
interface SpotifyOAuthWithMetadata extends LinkMetadata, Spotify {
  /** Denotes that this is a Tiktok account. */
  type: "spotify_oauth"
}

/** Object representation of a user's Instagram Account, with additional metadata for advanced use cases. */
interface InstagramOAuthWithMetadata extends LinkMetadata, Instagram {
  /** Denotes that this is a Instagram account. */
  type: "instagram_oauth"
}

/** Object representation of a user's Custom JWT Account, with additional metadata for advanced use cases. */
interface CustomJwtAccountWithMetadata extends LinkMetadata, CustomJwtAccount {
  /** Denotes that this is an custom account. */
  type: "custom_auth"
}

export type LinkedAccountWithMetadata =
  | WalletWithMetadata
  | EmailWithMetadata
  | PhoneWithMetadata
  | GoogleOAuthWithMetadata
  | TwitterOAuthWithMetadata
  | DiscordOAuthWithMetadata
  | GithubOAuthWithMetadata
  | SpotifyOAuthWithMetadata
  | InstagramOAuthWithMetadata
  | TiktokOAuthWithMetadata
  | LinkedInOAuthWithMetadata
  | AppleOAuthWithMetadata
  | CustomJwtAccountWithMetadata
  | FarcasterWithMetadata
  | PasskeyWithMetadata
  | TelegramWithMetadata
  | CrossAppAccountWithMetadata
