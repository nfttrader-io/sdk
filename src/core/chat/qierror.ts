import { CombinedError, ErrorLike } from "@urql/core"
import Maybe from "../../types/general/maybe"

/**
 * Custom error class that extends CombinedError from "@urql/core". QIError stands for Query Interaction Error.
 * It includes additional properties for reason and standardError.
 * @class QIError
 * @extends CombinedError
 */

export class QIError extends CombinedError {
  /**
   * @property {Maybe<string>} reason - The reason for the error.
   */
  reason: Maybe<string> = null
  /**
   * @property {boolean} standardError - Indicates if the error is a standard error.
   */
  standardError: boolean = true
  /**
   * @constructor
   * @param {object} input - An object containing networkError, graphQLErrors, and response.
   * @param {string} reason - The reason for the error.
   * @param {boolean} standardError - Indicates if the error is a standard error.
   */
  constructor(
    input: {
      networkError?: Error | undefined
      graphQLErrors?: (string | ErrorLike)[] | undefined
      response?: any
    },
    reason: string,
    standardError: boolean
  ) {
    super(input)
    this.reason = reason
    this.standardError = standardError
  }
}
