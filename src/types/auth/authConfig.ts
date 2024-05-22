import { AuthMode } from "../../enums/auth"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  /**
   * @property {AuthMode} mode - The authentication mode.
   */
  mode: AuthMode
  /**
   * @property {string} serviceName - The name of the authentication service.
   */
  serviceName: string
  /**
   * @property {string} serviceTOSURL - The Terms of Service URL for the authentication service.
   */
  serviceTOSURL: string
  /**
   * @property {string} servicePrivacyURL - The Privacy Policy URL for the authentication service.
   */
  servicePrivacyURL: string
}
