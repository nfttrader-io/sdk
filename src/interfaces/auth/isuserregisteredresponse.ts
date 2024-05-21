import { Maybe } from "../../types/base"
/**
 * Represents the response object for checking if a user is registered.
 */
export interface IsUserRegisteredResponse {
  /**
   * @property {Array< nonce: Maybe<string>>} data - the response object.
   */
  data: Array<{
    nonce: Maybe<string>
  }>
}
