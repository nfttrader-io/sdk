import { useLogout, usePrivy } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyLogout = (auth: Auth, device: "desktop" | "mobile") => {
  const initialized = useRef<boolean>(false)
  const { ready } = usePrivy()
  const { logout } = useLogout({
    onSuccess: () => {
      auth._emit("__onLogoutComplete", true)
    },
  })

  useEffect(() => {
    if (!initialized.current && ready && device === "desktop") {
      initialized.current = true

      auth.on("__logout", () => {
        console.log("logout")
        logout()
      })
    }
  }, [ready])
}
