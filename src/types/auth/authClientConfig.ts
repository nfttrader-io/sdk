import { Maybe } from "../../types/base"
import { AuthMode } from "../../enums/auth"

/**
 * Represents the configuration options for an authentication client.
 */
export type AuthClientConfig = {
  /**
   * @property {Maybe<string>} [backendURL] - The URL of the backend server.
   */
  backendURL?: Maybe<string>
  /**
   * @property {Maybe<AuthMode>} [mode] - The authentication mode to use.
   */
  mode?: Maybe<AuthMode>
  /**
   * @property {Maybe<string>} [serviceName] - The name of the authentication service.
   */
  serviceName?: Maybe<string>
  /**
   * @property {Maybe<string>} [serviceTOSURL] - The Terms of Service URL for the service.
   */
  serviceTOSURL?: Maybe<string>
  /**
   * @property {Maybe<string>} [servicePrivacyURL] - The Privacy Policy URL for the service.
   */
  servicePrivacyURL?: Maybe<string>
}
