import { OAuthProviderType } from "@privy-io/expo"

export type AuthenticationMobileOptions = {
  type: "email" | "sms" | "wallet" | "oauth" // | farcaster
  email?: string
  phone?: string
  OTPCode?: string
  provider?: Omit<OAuthProviderType, "farcaster">
}
