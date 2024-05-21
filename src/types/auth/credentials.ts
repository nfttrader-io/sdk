import { Maybe } from "../base"

/**
 * Defines a type for user credentials, which includes an address, email, and password.
 * Each field is optional and can be of type string or null.
 */
export type Credentials = {
  /**
   * @property {Maybe<string>} address - the address used to sign in/up.
   */
  address: Maybe<string>
  /**
   * @property {Maybe<string>} email - the email used to sign in/up
   */
  email: Maybe<string>
  /**
   * @property {Maybe<string>} password - the password used to sign in/up
   */
  password: Maybe<string>
}
