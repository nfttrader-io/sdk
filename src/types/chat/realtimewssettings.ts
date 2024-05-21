import { Maybe } from "../base"

/**
 * Represents the settings for a real-time WebSocket connection.
 */
export type RealTimeWebSocketSettings = {
  /**
   * @property {Maybe<number>} connectionTimeoutMs - The connection timeout in milliseconds.
   */
  connectionTimeoutMs: Maybe<number>
  /**
   * @property {Maybe<number>} connectionTimeoutSecs - The connection timeout in seconds.
   */
  connectionTimeoutSecs: Maybe<number>
}
