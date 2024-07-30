import { Auth } from "@src/auth"
import { useLoginWithEmail } from "@privy-io/expo"
import { useEffect, useRef } from "react"

export const usePrivyMobileLoginWithEmail = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { sendCode, loginWithCode } = useLoginWithEmail()

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      auth.on("__authenticate", () => {})
      auth._emit("__onPrivyReady")
    }
  }, [])
}
