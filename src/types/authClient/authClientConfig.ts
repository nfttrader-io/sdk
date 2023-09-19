import Maybe from "../general/maybe"
import AuthMode from "./authMode"

export type AuthClientConfig = {
  backendURL?: Maybe<string>
  mode?: Maybe<AuthMode>
  serviceName?: Maybe<string>
  serviceTOSURL?: Maybe<string>
  servicePrivacyURL?: Maybe<string>
}
