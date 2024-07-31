import { OAuthProviderType, useLoginWithOAuth } from "@privy-io/expo"
import { usePrivy } from "@privy-io/expo"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyMobileLoginWithOAuth = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { isReady, getAccessToken } = usePrivy()
  const { login } = useLoginWithOAuth({
    onError: (error) => {
      auth._emit("__onLoginError", error)
    },
    onSuccess: async (user, isNewUser) => {
      const authToken = await getAccessToken()

      auth._emit("__onOAuthAuthenticatedMobile", {
        user,
        isNewUser,
        wasAlreadyAuthenticated: false,
        loginMethod: "oauth",
        linkedAccount: {},
        authToken,
      })
    },
  })

  useEffect(() => {
    if (!initialized.current && isReady && device === "mobile") {
      initialized.current = true

      auth.on(
        "__authenticateMobileOAuth",
        async (options: { provider: OAuthProviderType }) => {
          await login({ provider: options.provider })
        }
      )

      auth._emit("__onPrivyReady")
    }
  }, [isReady])
}
