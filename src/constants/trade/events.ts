import TradeClientEventsMap from "../../interfaces/trade/eventsMap"

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
