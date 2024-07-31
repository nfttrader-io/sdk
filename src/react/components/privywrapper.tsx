import {
  useMobileWallet,
  usePrivyLinkAccount,
  usePrivyLogin,
  usePrivyLogout,
  usePrivyMobileLinkAccount,
  usePrivyMobileLoginWithEmail,
  usePrivyMobileLoginWithOAuth,
  usePrivyMobileLoginWithSiwe,
  usePrivyMobileLoginWithSMS,
  usePrivyMobileLogout,
} from "@src/react/hooks"
import { PrivyWrapperProps } from "@src/interfaces"
import React from "react"

export const PrivyWrapper: React.FC<PrivyWrapperProps> = ({
  auth,
  trade,
  device,
  children,
}) => {
  usePrivyLogin(auth, device)
  usePrivyLogout(auth, device)
  usePrivyLinkAccount(auth, device)
  useMobileWallet(auth, device)
  usePrivyMobileLinkAccount(auth, device)
  usePrivyMobileLoginWithEmail(auth, device)
  usePrivyMobileLoginWithOAuth(auth, device)
  usePrivyMobileLoginWithSiwe(auth, device)
  usePrivyMobileLoginWithSMS(auth, device)
  usePrivyMobileLogout(auth, device)
  usePrivyLinkAccount(auth, device)

  return <>{children}</>
}
