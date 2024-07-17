import { useLogout } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyLogout = (auth: Auth) => {
  const initialized = useRef(false)
  const { logout } = useLogout({
    onSuccess: () => {
      auth._emit("__onLogoutComplete", true)
    },
  })

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      auth._on("__logout", () => {
        console.log("logout")
        logout()
      })
    }
  }, [])
}
