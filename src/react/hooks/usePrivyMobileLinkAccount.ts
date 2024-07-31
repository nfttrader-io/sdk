import { Auth } from "@src/auth"
import {
  OAuthProviderType,
  useLinkEmail,
  useLinkSMS,
  useLinkWithOAuth,
  useLinkWithSiwe,
  usePrivy,
} from "@privy-io/expo"
import { useEffect, useRef } from "react"
import { useSDK as useMetamaskSDK } from "@metamask/sdk-react"

export const usePrivyMobileLinkAccount = (
  auth: Auth,
  device: "desktop" | "mobile"
) => {
  const initialized = useRef<boolean>(false)
  const { isReady: isPrivyReady, getAccessToken } = usePrivy()
  const { sendCode: sendCodeEmail, linkWithCode: linkWithCodeEmail } =
    useLinkEmail({
      onSendCodeSuccess: ({ email }) => {
        auth._emit("__onEmailOTPCodeAfterAuthSent", email)
      },
      onError: (error) => {
        auth._emit("__onLinkAccountError", error)
      },
      onLinkSuccess: async (user) => {
        const authToken = await getAccessToken()

        auth._emit("__onLinkAccountComplete", {
          user,
          isNewUser: false,
          wasAlreadyAuthenticated: false,
          loginMethod: "email",
          linkedAccount: {},
          authToken,
        })
      },
    })
  const { sendCode: sendCodeSMS, linkWithCode: linkWithCodeSMS } = useLinkSMS({
    onSendCodeSuccess: ({ phone }) => {
      auth._emit("__onSMSOTPCodeAfterAuthSent", phone)
    },
    onError: (error) => {
      auth._emit("__onLinkAccountError", error)
    },
    onLinkSuccess: async (user) => {
      const authToken = await getAccessToken()

      auth._emit("__onLinkAccountComplete", {
        user,
        isNewUser: false,
        wasAlreadyAuthenticated: false,
        loginMethod: "email",
        linkedAccount: {},
        authToken,
      })
    },
  })
  const { link: linkOAuth } = useLinkWithOAuth({
    onError: (error) => {
      auth._emit("__onLinkAccountError", error)
    },
    onSuccess: async (user, isNewUser) => {
      const authToken = await getAccessToken()

      //to verify
      auth._emit("__onOAuthLinkAuthenticatedMobile", {
        user,
        isNewUser,
        wasAlreadyAuthenticated: false,
        loginMethod: "oauth",
        linkedAccount: {},
        authToken,
      })
    },
  })
  const { generateSiweMessage, linkWithSiwe } = useLinkWithSiwe({
    onGenerateMessage: (signature: string) => {
      linkWithSiwe({ signature })
    },
    onSuccess: async (user, isNewUser) => {
      const authToken = await getAccessToken()

      auth._emit("__onLinkAccountComplete", {
        user,
        isNewUser,
        wasAlreadyAuthenticated: false,
        loginMethod: "wallet",
        linkedAccount: {},
        authToken,
      })
    },
    onError: (error) => {
      auth._emit("__onLinkAccountError", error)
    },
  })

  const {
    sdk: metamaskSDK,
    ready: metamaskReady,
    account: metamaskAccount,
    chainId: metamaskChainId,
    connected: metamaskConnected,
  } = useMetamaskSDK()

  useEffect(() => {
    auth.on("__onMetamaskConnect", async () => {
      if (
        metamaskReady &&
        metamaskChainId &&
        metamaskConnected &&
        metamaskAccount &&
        isPrivyReady
      ) {
        try {
          await generateSiweMessage({
            from: {
              domain: "loopz.xyz",
              uri: "https://loopz.xyz",
            },
            wallet: {
              chainId: `eip155:${metamaskChainId}`,
              address: metamaskAccount,
            },
          })
        } catch (error) {
          auth._emit("__onLinkAccountError", {
            state: "generating_siwe",
            originalError: error,
          })
        }
      }
    })
  }, [
    metamaskAccount,
    metamaskChainId,
    metamaskConnected,
    metamaskReady,
    isPrivyReady,
  ])

  useEffect(() => {
    if (
      !initialized.current &&
      isPrivyReady &&
      metamaskSDK &&
      metamaskReady &&
      device === "mobile"
    ) {
      initialized.current = true

      //email
      auth.on("__sendEmailOTPCodeAfterAuth", async (email: string) => {
        try {
          const status = await sendCodeEmail({ email })
          if (!status.success)
            auth._emit(
              "__onEmailOTPCodeAfterAuthSentError",
              "OTP code sending failed."
            )
        } catch (error) {
          auth._emit("__onEmailOTPCodeAfterAuthSentError", error)
        }
      })

      auth.on(
        "__linkMobileEmail",
        async ({ email, OTP }: { email: string; OTP: string }) => {
          await linkWithCodeEmail({ code: OTP, email })
        }
      )

      //phone
      auth.on("__sendSMSOTPCodeAfterAuth", async (phone: string) => {
        try {
          const status = await sendCodeSMS({ phone })
          if (!status.success)
            auth._emit(
              "__onSMSOTPCodeSentAfterAuthError",
              "OTP code sending failed."
            )
        } catch (error) {
          auth._emit("__onSMSOTPCodeSentAfterAuthError", error)
        }
      })

      auth.on(
        "__linkMobileSMS",
        async ({ phone, OTP }: { phone: string; OTP: string }) => {
          await linkWithCodeSMS({ code: OTP, phone })
        }
      )

      //oauth
      auth.on(
        "__linkMobileOAuth",
        async (options: { provider: OAuthProviderType }) => {
          await linkOAuth({ provider: options.provider })
        }
      )

      //wallet
      auth.on(
        "__linkMobileWallet",
        async ({ wallet }: { wallet: "metamask" }) => {
          if (wallet === "metamask") {
            const { connect } = metamaskSDK
            try {
              await connect()
              auth._emit("__onMetamaskConnect")
            } catch (error) {
              auth._emit("__onLinkAccountError", {
                state: "connecting_metamask",
                orginalError: error,
              })
            }
          }
        }
      )
    }
  }, [isPrivyReady, metamaskReady, metamaskSDK])
}
