import { ILoopzContext } from "@src/interfaces"
import { createContext } from "react"

export const LoopzContext = createContext<ILoopzContext | undefined>(undefined)
