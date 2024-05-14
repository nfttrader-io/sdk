import E2E from "../../../e2e"

export interface EngineInitConfig {
  jwtToken: string
  apiKey: string
  apiUrl: string
  realtimeApiUrl: string
  e2e: E2E
}
