import React from "react"
import { Maybe } from "@src/types"
import { PrivyAdapterOptions } from "@src/types/adapter"
import { createRoot, Root } from "react-dom/client"
import { v4 as uuid } from "uuid"
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { Trade } from "@src/trade"
import { usePrivyLogin } from "./login"
import { usePrivyLogout } from "./logout"
import { usePrivyLinkAccount } from "./linkaccount"

interface PrivyAdapterProps {
  auth: Auth
  trade: Trade
  appId: string
  config: PrivyClientConfig
}

interface PrivyWrapperProps {
  auth: Auth
  trade: Trade
}

const PrivyWrapper: React.FC<PrivyWrapperProps> = ({ auth, trade }) => {
  usePrivyLogin(auth)
  usePrivyLogout(auth)
  usePrivyLinkAccount(auth)

  return <></>
}

const PrivyContext: React.FC<PrivyAdapterProps> = ({
  auth,
  trade,
  appId,
  config,
}) => {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        ...config,
      }}
    >
      <PrivyWrapper auth={auth} trade={trade} />
    </PrivyProvider>
  )
}

export class PrivyAdapter {
  private _container: Maybe<HTMLElement> = null

  private _root: Maybe<Root> = null

  private _privyAppId: string

  private _privyConfig?: PrivyClientConfig

  constructor(privyAdapterOptions: PrivyAdapterOptions) {
    this._privyAppId = privyAdapterOptions.appId

    if (typeof window !== "undefined") {
      // Desktop implementation
      this._container = document.createElement("div")
      this._container.id = uuid()

      document.body.appendChild(this._container)

      this._root = createRoot(this._container!)
      this._privyConfig = privyAdapterOptions.desktopOptions!
    } else {
      // React Native implementation
    }
  }

  render(auth: Auth, trade: Trade) {
    if (typeof window !== "undefined") {
      if (!this._root) throw new Error("Root object must be initializated.")
      if (!this._privyConfig)
        throw new Error("Privy configuration must be setup.")

      this._root.render(
        <PrivyContext
          auth={auth}
          trade={trade}
          appId={this._privyAppId}
          config={this._privyConfig}
        />
      )
    } else {
    }
  }

  cleanup() {
    if (typeof window !== "undefined") {
      if (this._container && this._root) {
        this._root.unmount()
        document.body.removeChild(this._container)
      }
    }
  }
}
