import { usePrivy } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyUnlinkAccount = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const {
    user,
    ready,
    unlinkEmail,
    unlinkApple,
    unlinkDiscord,
    unlinkFarcaster,
    unlinkGithub,
    unlinkGoogle,
    unlinkInstagram,
    unlinkLinkedIn,
    unlinkPhone,
    unlinkSpotify,
    unlinkTelegram,
    unlinkTiktok,
    unlinkTwitter,
    unlinkWallet,
  } = usePrivy()

  useEffect(() => {
    if (!initialized.current && ready && user && device === "desktop") {
      initialized.current = true

      auth.on(
        "__unlink",
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
          if (method === "apple" && user.apple)
            unlinkApple(user.apple.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "discord" && user.discord)
            unlinkDiscord(user.discord.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "email" && user.email)
            unlinkEmail(user.email.address)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "farcaster" && user.farcaster)
            unlinkFarcaster(user.farcaster.fid!)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "github" && user.github)
            unlinkGithub(user.github.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "google" && user.google)
            unlinkGoogle(user.google.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "instagram" && user.instagram)
            unlinkInstagram(user.instagram.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "linkedin" && user.linkedin)
            unlinkLinkedIn(user.linkedin.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "phone" && user.phone)
            unlinkPhone(user.phone.number)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "spotify" && user.spotify)
            unlinkSpotify(user.spotify.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "tiktok" && user.tiktok)
            unlinkTiktok(user.tiktok.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "twitter" && user.twitter)
            unlinkTwitter(user.twitter.subject)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "wallet" && user.wallet)
            unlinkWallet(user.wallet.address)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "telegram" && user.telegram)
            unlinkTelegram(user.telegram.telegramUserId)
              .then(() => {
                auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                auth._emit("__onUnlinkAccountError", error)
              })
        }
      )
    }
  }, [ready, user])
}
