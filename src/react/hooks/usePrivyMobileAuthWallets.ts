import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"
import { useSDK as useMetamaskSDK } from "@metamask/sdk-react"
import { useLoginWithSiwe, usePrivy } from "@privy-io/expo"

export const usePrivyMobileAuthWallets = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { isReady: isPrivyReady, getAccessToken } = usePrivy()
  const { generateSiweMessage, loginWithSiwe } = useLoginWithSiwe({
    onGenerateMessage: (signature: string) => {
      loginWithSiwe({ signature })
    },
    onSuccess: async (user, isNewUser) => {
      const authToken = await getAccessToken()

      auth._emit("__onLoginComplete", {
        user,
        isNewUser,
        wasAlreadyAuthenticated: false,
        loginMethod: "wallet",
        linkedAccount: {},
        authToken,
      })
    },
    onError: (error) => {
      auth._emit("__onLoginError", error)
    },
  })

  const {
    sdk: metamaskSDK,
    ready: metamaskReady,
    account: metamaskAccount,
    chainId: metamaskChainId,
    connected: metamaskConnected,
  } = useMetamaskSDK()

  useEffect(() => {
    auth.on("__onMetamaskConnect", async () => {
      if (
        metamaskReady &&
        metamaskChainId &&
        metamaskConnected &&
        metamaskAccount &&
        isPrivyReady
      ) {
        try {
          await generateSiweMessage({
            from: {
              domain: "loopz.xyz",
              uri: "https://loopz.xyz",
            },
            wallet: {
              chainId: `eip155:${metamaskChainId}`,
              address: metamaskAccount,
            },
          })
        } catch (error) {
          auth._emit("__onLoginError", {
            state: "generating_siwe",
            originalError: error,
          })
        }
      }
    })
  }, [
    metamaskAccount,
    metamaskChainId,
    metamaskConnected,
    metamaskReady,
    isPrivyReady,
  ])

  useEffect(() => {
    if (
      !initialized.current &&
      metamaskReady &&
      metamaskSDK &&
      isPrivyReady &&
      device === "mobile"
    ) {
      initialized.current = true
      auth.on(
        "__authenticateMobileWallet",
        async ({ wallet }: { wallet: "metamask" }) => {
          if (wallet === "metamask") {
            const { connect } = metamaskSDK
            try {
              await connect()
              auth._emit("__onMetamaskConnect")
            } catch (error) {
              auth._emit("__onLoginError", {
                state: "connecting_metamask",
                orginalError: error,
              })
            }
          }
        }
      )
    }
  }, [metamaskReady, metamaskSDK, isPrivyReady])
}
