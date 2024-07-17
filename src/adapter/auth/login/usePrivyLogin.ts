import { useLogin, usePrivy } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyLogin = (auth: Auth) => {
  const initialized = useRef(false)
  const { ready, authenticated, getAccessToken } = usePrivy()
  const disableLogin = !ready || (ready && authenticated)

  const { login } = useLogin({
    onComplete: async (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount
    ) => {
      const authToken = await getAccessToken()

      auth._emit("__onLoginComplete", {
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount,
        authToken,
      })
    },
    onError: (error) => {
      auth._emit("__onLoginError", error)
    },
  })

  useEffect(() => {
    if (!initialized.current && ready && !disableLogin) {
      initialized.current = true

      auth._on("__authenticate", () => {
        login()
      })
      auth._emit("__onPrivyReady")
    }
  }, [ready, disableLogin])
}
