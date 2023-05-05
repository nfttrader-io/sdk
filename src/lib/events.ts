import TradeClientEventsMap from "../types/tradeClient/eventsMap"

export default [
  "cancelTradeTransactionCreated",
  "cancelTradeTransactionMined",
  "cancelTradeTransactionError",
  "cancelTradeError",
  "execTradeTransactionCreated",
  "execTradeTransactionMined",
  "execTradeTransactionError",
  "execTradeError",
] as Array<keyof TradeClientEventsMap>
