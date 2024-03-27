import AuthMode from "./authMode"

export type AuthConfig = {
  mode: AuthMode
  serviceName: string
  serviceTOSURL: string
  servicePrivacyURL: string
}
