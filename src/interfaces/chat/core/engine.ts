import Maybe from "../../../types/general/maybe"

export interface Engine {
  getJWTToken(): Maybe<string>
  getApiKey(): Maybe<string>
  getApiURL(): Maybe<string>
  getRealtimeApiURL(): Maybe<string>
}
