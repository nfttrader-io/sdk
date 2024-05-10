import { SubscriptionGarbage } from "../../../types/chat/subscriptiongarbage"
import Maybe from "../../../types/general/maybe"

/**
 * Interface for an Engine that defines methods for connecting, reconnecting, collecting garbage,
 * refreshing JWT token, and getting API related information.
 * @interface Engine
 */
export interface Engine {
  connect(callback: Function): void
  reconnect(callback: Function): void
  collect(garbage: Array<SubscriptionGarbage> | SubscriptionGarbage): void
  refreshJWTToken(jwt: string): void
  getJWTToken(): Maybe<string>
  getApiKey(): Maybe<string>
  getApiURL(): Maybe<string>
  getRealtimeApiURL(): Maybe<string>
}
