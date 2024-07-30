import {
  usePrivyLinkAccount,
  usePrivyLogin,
  usePrivyLogout,
} from "@src/adapter"
import { PrivyWrapperProps } from "@src/interfaces"
import React from "react"

export const PrivyWrapper: React.FC<PrivyWrapperProps> = ({
  auth,
  trade,
  children,
}) => {
  usePrivyLogin(auth)
  usePrivyLogout(auth)
  usePrivyLinkAccount(auth)

  return <>{children}</>
}
