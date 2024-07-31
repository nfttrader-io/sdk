import { useLoginWithSiwe, usePrivy } from "@privy-io/expo"
import { Auth } from "@src/auth"
import { useRef } from "react"

export const usePrivyMobileLoginWithSiwe = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { isReady, getAccessToken } = usePrivy()
  const { generateSiweMessage, loginWithSiwe } = useLoginWithSiwe()
}
