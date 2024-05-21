import { Maybe } from "../../types/base"
/**
 * Represents the initialization options for an HTTP request.
 * @interface HTTPRequestInit
 */
export interface HTTPRequestInit {
  /**
   * @property {string} method - The HTTP method for the request (GET, POST, PUT, DELETE).
   */
  method: "GET" | "POST" | "PUT" | "DELETE"
  /**
   * @property {Maybe<{ [k: string]: string }>} [headers] - Optional headers for the request.
   */
  headers?: Maybe<{ [k: string]: string }>
  /**
   * @property {Maybe<{ [k: string]: any }>} [body] - Optional body content for the request.
   */
  body?: Maybe<{ [k: string]: any }>
}
