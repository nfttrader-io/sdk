import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { LoopzConfig } from "@src/types/app/loopzconfig"
import { Loopz } from "@src/loopz"
import { Auth } from "@src/auth"
import { Trade } from "@src/trade"
import { Oracle } from "@src/oracle"
import { Post } from "@src/post"
import { PrivyProvider as PrivyProviderDesktop } from "@privy-io/react-auth"
import { PrivyProvider as PrivyProviderReactNative } from "@privy-io/expo"
import { PrivyWrapper } from "./privywrapper"
import "fast-text-encoding"
import "react-native-get-random-values"
import "@ethersproject/shims"

interface LoopzProviderProps {
  config: LoopzConfig
  children: ReactNode
}

interface LoopzDesktopProviderProps {
  config: LoopzConfig
  auth: Auth
  trade: Trade
  children: ReactNode
}

interface LoopzReactNativeProviderProps {
  config: LoopzConfig
  auth: Auth
  trade: Trade
  children: ReactNode
}

interface LoopzContext {
  loopz: Loopz
  auth: Auth
  trade: Trade
  post: Post
  oracle: Oracle
}

const LoopzContext = createContext<LoopzContext | undefined>(undefined)

export const useLoopz = () => {
  const context = useContext(LoopzContext)
  if (typeof context === "undefined")
    throw new Error("useLoopz must be used within a LoopzProvider.")

  return context
}

export const LoopzProvider: React.FC<LoopzProviderProps> = ({
  config,
  children,
}) => {
  const initialized = useRef<boolean>(false)
  const authRef = useRef<Auth>()
  const tradeRef = useRef<Trade>()
  const oracleRef = useRef<Oracle>()
  const postRef = useRef<Post>()

  const [loopzContext, setLoopzContext] = useState<LoopzContext | null>(null)
  const [loopzInitialized, setLoopzInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      //Loopz.boot(config, false) -> runAdapter arg is false. Why?
      //It is false because we are executing Loopz in a React/React Native context and there is no need to inject a React component in the DOM.
      //in this way we are sure we will handle all the Privy interaction directly from the components defined in this file.
      Loopz.boot(config, false).then((loopz: Loopz) => {
        const { auth, trade, oracle, post } = loopz.init()

        authRef.current = auth
        tradeRef.current = trade
        oracleRef.current = oracle
        postRef.current = post

        setLoopzContext({ auth, trade, oracle, post, loopz })
      })
    }
  }, [config])

  useEffect(() => {
    if (loopzContext) setLoopzInitialized(true)
  }, [loopzContext])

  return loopzInitialized ? (
    <LoopzContext.Provider value={loopzContext!}>
      {typeof window !== "undefined" ? (
        <>
          {loopzInitialized && authRef.current && tradeRef.current && (
            <LoopzDesktopProvider
              config={config}
              auth={authRef.current}
              trade={tradeRef.current}
            >
              {children}
            </LoopzDesktopProvider>
          )}
        </>
      ) : (
        <>
          {loopzInitialized && authRef.current && tradeRef.current && (
            <LoopzReactNativeProvider
              config={config}
              auth={authRef.current}
              trade={tradeRef.current}
            >
              {children}
            </LoopzReactNativeProvider>
          )}
        </>
      )}
    </LoopzContext.Provider>
  ) : (
    <></>
  )
}

const LoopzDesktopProvider: React.FC<LoopzDesktopProviderProps> = ({
  config,
  auth,
  trade,
  children,
}) => {
  return (
    <PrivyProviderDesktop
      appId={config.privyAppId}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        ...config.privyClientConfig,
      }}
    >
      <PrivyWrapper auth={auth} trade={trade}>
        {children}
      </PrivyWrapper>
    </PrivyProviderDesktop>
  )
}

const LoopzReactNativeProvider: React.FC<LoopzReactNativeProviderProps> = ({
  config,
  auth,
  trade,
  children,
}) => {
  return (
    <PrivyProviderReactNative
      appId={config.privyAppId}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        ...config.privyClientConfig,
      }}
    >
      <PrivyWrapper auth={auth} trade={trade}>
        {children}
      </PrivyWrapper>
    </PrivyProviderReactNative>
  )
}
