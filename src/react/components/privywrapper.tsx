import {
  usePrivyMobileAuthWallets,
  usePrivyLinkAccount,
  usePrivyLogin,
  usePrivyLogout,
  usePrivyMobileLinkAccount,
  usePrivyMobileLoginWithEmail,
  usePrivyMobileLoginWithOAuth,
  usePrivyMobileLoginWithSiwe,
  usePrivyMobileLoginWithSMS,
  usePrivyMobileLogout,
  usePrivyUnlinkAccount,
} from "@src/react/hooks"
import { PrivyWrapperProps } from "@src/interfaces"
import React from "react"
import { usePrivyWallets } from "../hooks/usePrivyWallets"

export const PrivyWrapper: React.FC<PrivyWrapperProps> = ({
  auth,
  trade,
  device,
  children,
}) => {
  //used in desktop environment (React, Angular, Vanilla js, Vue)
  //if device is equal to "mobile" for example, inside the hooks there is a check to avoid that these functions will be executed.
  usePrivyLogin(auth, device)
  usePrivyLogout(auth, device)
  usePrivyLinkAccount(auth, device)
  usePrivyUnlinkAccount(auth, device)
  usePrivyWallets(trade, device)

  //used in mobile environment (React Native)
  //if device is equal to "desktop" for example, inside the hooks there is a check to avoid that these functions will be executed.
  usePrivyMobileAuthWallets(auth, device)
  usePrivyMobileLinkAccount(auth, device)
  usePrivyMobileLoginWithEmail(auth, device)
  usePrivyMobileLoginWithOAuth(auth, device)
  usePrivyMobileLoginWithSiwe(auth, device)
  usePrivyMobileLoginWithSMS(auth, device)
  usePrivyMobileLogout(auth, device)

  return <>{children}</>
}
