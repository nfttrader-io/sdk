import { OAuthProviderType } from "@privy-io/react-auth"

export type LoginMethod =
  | "email"
  | "sms"
  | "siwe"
  | "farcaster"
  | OAuthProviderType
  | "passkey"
  | "telegram"
  | "custom"
  | `privy:${string}`
