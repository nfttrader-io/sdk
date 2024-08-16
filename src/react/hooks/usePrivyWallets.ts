import { useWallets } from "@privy-io/react-auth"
import { Trade } from "@src/trade"
import { useEffect, useRef } from "react"

export const usePrivyWallets = (trade: Trade, device: "desktop" | "mobile") => {
  const initialized = useRef<boolean>(false)
  const { ready, wallets } = useWallets()

  useEffect(() => {
    if (!initialized.current && ready && device === "desktop") {
      const account = trade.getCurrentAccount()
      console.log(account)
      if (account) account.setWallets(wallets)
    }
  }, [ready])
}
