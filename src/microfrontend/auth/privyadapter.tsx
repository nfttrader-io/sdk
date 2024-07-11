import { Maybe } from "@src/types"
import { PrivyAdapterOptions } from "@src/types/adapter"
import { createRoot, Root } from "react-dom/client"
import { v4 as uuid } from "uuid"
import {
  PrivyClientConfig,
  PrivyProvider,
  usePrivy,
} from "@privy-io/react-auth"
import React, { useEffect } from "react"
import { useLogin } from "@privy-io/react-auth"

interface PrivyAdapterProps {
  appId: string
  config: PrivyClientConfig
}

const PrivyAuth: React.FC<PrivyAdapterProps> = ({ appId, config }) => {
  const { ready, authenticated } = usePrivy()
  const disableLogin = !ready || (ready && authenticated)

  const { login } = useLogin({
    onComplete: (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount
    ) => {
      console.log(
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount
      )
    },
    onError: (error) => {
      console.log(error)
    },
  })

  useEffect(() => {
    if (ready) if (!disableLogin) login()
  }, [ready, disableLogin])

  return (
    <PrivyProvider
      appId={appId}
      config={{
        ...config,
      }}
    >
      <></>
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

  render() {
    if (typeof window !== "undefined") {
      if (!this._root) throw new Error("Root object must be initializated.")
      if (!this._privyConfig)
        throw new Error("Privy configuration must be setup.")

      this._root.render(
        <PrivyAuth appId={this._privyAppId} config={this._privyConfig} />
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
