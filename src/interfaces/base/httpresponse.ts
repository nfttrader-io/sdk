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
  response: Maybe<DataType>
}
