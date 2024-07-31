import { useLoginWithSMS, usePrivy } from "@privy-io/expo"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyMobileLoginWithSMS = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { isReady, getAccessToken } = usePrivy()
  const { sendCode, loginWithCode } = useLoginWithSMS({
    onSendCodeSuccess: ({ phone }) => {
      auth._emit("__onSMSOTPCodeSent", phone)
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

      auth.on("__sendSMSOTPCode", async (phone: string) => {
        try {
          const status = await sendCode({ phone })
          if (!status.success)
            auth._emit("__onSMSOTPCodeSentError", "OTP code sending failed.")
        } catch (error) {
          auth._emit("__onSMSOTPCodeSentError", error)
        }
      })

      auth.on(
        "__authenticateMobileSMS",
        async ({ phone, OTP }: { phone: string; OTP: string }) => {
          await loginWithCode({ code: OTP, phone })
        }
      )

      auth._emit("__onPrivyReady")
    }
  }, [isReady])
}
