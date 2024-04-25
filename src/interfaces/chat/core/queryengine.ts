export interface QueryEngine {
  getJWTToken: () => string | null
  getApiKey: () => string | null
  getApiURL: () => string | null
  getRealtimeApiURL: () => string | null
}
