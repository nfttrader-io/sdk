import { PrivyClientConfig } from "@privy-io/react-auth"

export type PrivyAdapterOptions = {
  appId: string
  device: "desktop" | "mobile"
  desktopOptions?: PrivyClientConfig
  mobileOptions?: {}
}
