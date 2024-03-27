import TradeClientErrorTypeMap from "./errorTypeMap"

export default interface TradeClientEventError<
  EventName extends keyof TradeClientErrorTypeMap
> {
  error: any
  typeError: "waitError" | "ApiError" | TradeClientErrorTypeMap[EventName]
}
