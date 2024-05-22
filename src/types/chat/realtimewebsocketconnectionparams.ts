import { Maybe } from "../base"

/**
 * Represents the parameters required for establishing a real-time WebSocket connection.
 */
export type RealTimeWebSocketConnectionParams = {
  /**
   * @property {Maybe<string>} Authorization - The authorization token for the connection.
   */
  Authorization: Maybe<string>
  /**
   * @property {Maybe<string>} host - The host URL for the WebSocket connection.
   */
  host: Maybe<string>
}
