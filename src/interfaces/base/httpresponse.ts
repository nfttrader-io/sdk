/**
 * Represents an HTTP response object with optional data and error properties.
 */
import { Maybe } from "../../types/base"

export interface HTTPResponse<DataType = any> {
  /**
   * @property {number} statusCode - The status code of the HTTP response.
   */
  statusCode: number
  /**
   * @property {string} statusMessage - The status message of the HTTP response.
   */
  statusMessage: string
  /**
   * @property {Maybe<DataType>} [data] - The data returned in the response, if any.
   */
  data?: Maybe<DataType>
  /**
   * @property {Error | Maybe<DataType>} [error] - The error object or data in case of an error.
   */
  error?: Error | Maybe<DataType>
  /**
   * @property {boolean} [isFetchError] - Indicates if the response is a fetch error.
   */
  isFetchError?: boolean
}
