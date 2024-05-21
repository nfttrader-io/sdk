/**
 * Represents the response object received after a signup request.
 */
import { Maybe } from "../../types/base"

export interface SignupResponse {
  /**
   * @property {Array< nonce: Maybe<string>>} data - the response object.
   */
  data: Array<{
    nonce: Maybe<string>
  }>
}
