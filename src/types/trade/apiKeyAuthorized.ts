type ApiKeyAuthorized<Payload> = {
  apiKey: string
} & Payload

export default ApiKeyAuthorized
