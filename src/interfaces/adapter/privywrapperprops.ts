import { Auth } from "@src/auth"
import { Trade } from "@src/trade"
import { ReactNode } from "react"

export interface PrivyWrapperProps {
  auth: Auth
  trade: Trade
  children: ReactNode
}
