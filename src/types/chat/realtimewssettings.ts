import Maybe from "../general/maybe"

export type RealTimeWebSocketSettings = {
  connectionTimeoutMs: Maybe<number>
  connectionTimeoutSecs: Maybe<number>
}
