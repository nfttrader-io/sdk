import { Auth } from "@src/auth"
import { Trade } from "@src/trade"
import { LoopzConfig } from "@src/types/app/loopzconfig"
import { ReactNode } from "react"

export interface LoopzDesktopProviderProps {
  config: LoopzConfig
  auth: Auth
  trade: Trade
  children: ReactNode
}
