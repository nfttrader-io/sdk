export type PrivyAppearanceOptions = {
  logo: string
  landingHeader: string
  loginMessage: string
  theme: "light" | "dark" | string
  showWalletLoginFirst: boolean
  walletList: Array<string>
}
