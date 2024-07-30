import {
  usePrivyLinkAccount,
  usePrivyLogin,
  usePrivyLogout,
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

  return <>{children}</>
}
