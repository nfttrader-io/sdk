import { LoopzConfig } from "@src/types/app/loopzconfig"
import { ReactNode } from "react"

export interface LoopzProviderProps {
  config: LoopzConfig
  children: ReactNode
}
