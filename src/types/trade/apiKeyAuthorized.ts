/**
 * Represents an object that includes an API key along with additional payload data.
 * @template Payload - The type of additional payload data included with the API key.
 */
type ApiKeyAuthorized<Payload> = {
  /**
   * @property {string} apiKey - The API key used for authorization.
   */
  apiKey: string
} & Payload

export { ApiKeyAuthorized }
