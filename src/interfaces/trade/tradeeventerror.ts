/**
 * Represents an error event in the TradeClient with a specific event name.
 * @interface TradeEventError - The type of event that caused the error.
 */
import { TradeErrorMap } from "./tradeerrormap"

export interface TradeEventError<EventName extends keyof TradeErrorMap> {
  /**
   * @property {any} error - The error object associated with the event.
   */
  error: any
  /**
   * @property {"waitError" | "ApiError" | TradeErrorMap[EventName]} typeError - The type of error that occurred.
   */
  typeError: "waitError" | "ApiError" | TradeErrorMap[EventName]
}
