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

      //need to try farcaster and telegram
      if (
        loginMethod === "apple" ||
        loginMethod === "discord" ||
        loginMethod === "github" ||
        loginMethod === "google" ||
        loginMethod === "instagram" ||
        loginMethod === "linkedin" ||
        loginMethod === "spotify" ||
        loginMethod === "tiktok" ||
        loginMethod === "twitter"
      )
        //these services brings the user out of the current web page, so we should listen this event when the Auth object boots
        auth._emit("__onExternalProviderAuthenticated", {
          user,
          isNewUser,
          wasAlreadyAuthenticated,
          loginMethod,
          linkedAccount,
          authToken,
        })
      else
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
