import { Auth } from "@src/auth"
import { useLoginWithEmail, usePrivy } from "@privy-io/expo"
import { useEffect, useRef } from "react"

export const usePrivyMobileLoginWithEmail = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { isReady, getAccessToken } = usePrivy()
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess: ({ email }) => {
      auth._emit("__onEmailOTPCodeSent", email)
    },
    onError: (error) => {
      auth._emit("__onLoginError", error)
    },
    onLoginSuccess: async (user, isNewUser) => {
      const authToken = await getAccessToken()

      auth._emit("__onLoginComplete", {
        user,
        isNewUser,
        wasAlreadyAuthenticated: false,
        loginMethod: "email",
        linkedAccount: {},
        authToken,
      })
    },
  })

  useEffect(() => {
    if (!initialized.current && isReady && device === "mobile") {
      initialized.current = true

      auth.on("__sendEmailOTPCode", async (email: string) => {
        try {
          const status = await sendCode({ email })
          if (!status.success)
            auth._emit("__onEmailOTPCodeSentError", "OTP code sending failed.")
        } catch (error) {
          auth._emit("__onEmailOTPCodeSentError", error)
        }
      })

      auth.on(
        "__authenticateMobileEmail",
        async ({ email, OTP }: { email: string; OTP: string }) => {
          await loginWithCode({ code: OTP, email })
        }
      )

      auth._emit("__onPrivyReady")
    }
  }, [isReady])
}
