import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"
import { useLinkAccount, usePrivy } from "@privy-io/react-auth"

export const usePrivyLinkAccount = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { ready, authenticated, user } = usePrivy()

  const {
    linkApple,
    linkDiscord,
    linkEmail,
    linkFarcaster,
    linkGithub,
    linkGoogle,
    linkInstagram,
    linkLinkedIn,
    linkPhone,
    linkSpotify,
    linkTiktok,
    linkTwitter,
    linkWallet,
    linkTelegram,
  } = useLinkAccount({
    onSuccess: (user, linkMethod, linkedAccount) => {
      auth._emit("__onLinkAccountComplete", { user, linkMethod, linkedAccount })
    },
    onError: (error, details) => {
      auth._emit("__onLinkAccountError", { error, details })
    },
  })

  useEffect(() => {
    if (
      !initialized.current &&
      ready &&
      authenticated &&
      user &&
      device === "desktop"
    ) {
      initialized.current = true

      auth.on(
        "__link",
        (
          method:
            | "apple"
            | "discord"
            | "email"
            | "farcaster"
            | "github"
            | "google"
            | "instagram"
            | "linkedin"
            | "phone"
            | "spotify"
            | "tiktok"
            | "twitter"
            | "wallet"
            | "telegram"
        ) => {
          if (method === "apple" && !user.apple) linkApple()
          if (method === "discord" && !user.discord) linkDiscord()
          if (method === "email" && !user.email) linkEmail()
          if (method === "farcaster" && !user.farcaster) linkFarcaster()
          if (method === "github" && !user.github) linkGithub()
          if (method === "google" && !user.google) linkGoogle()
          if (method === "instagram" && !user.instagram) linkInstagram()
          if (method === "linkedin" && !user.linkedin) linkLinkedIn()
          if (method === "phone" && !user.phone) linkPhone()
          if (method === "spotify" && !user.spotify) linkSpotify()
          if (method === "tiktok" && !user.tiktok) linkTiktok()
          if (method === "twitter" && !user.twitter) linkTwitter()
          if (method === "wallet" && !user.wallet) linkWallet()
          if (method === "telegram" && !user.telegram) linkTelegram()
        }
      )
    }
  }, [ready, authenticated, user])
}
