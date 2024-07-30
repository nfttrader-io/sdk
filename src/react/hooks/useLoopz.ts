import { useContext } from "react"
import { LoopzContext } from "../context"

export const useLoopz = () => {
  const context = useContext(LoopzContext)
  if (typeof context === "undefined")
    throw new Error("useLoopz must be used within a LoopzProvider.")

  return context
}
