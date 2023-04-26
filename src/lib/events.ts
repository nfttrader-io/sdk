import TradeClientEventsMap from "../types/tradeClient/eventsMap"

export default [
  "createTradeTransactionCreated",
  "createTradeTransactionMined",
  "createTradeTransactionError",
  "cancelTradeTransactionCreated",
  "cancelTradeTransactionMined",
  "cancelTradeTransactionError",
  "cancelTradeError",
  "execTradeTransactionCreated",
  "execTradeTransactionMined",
  "execTradeTransactionError",
  "execTradeError",
] as Array<keyof TradeClientEventsMap>
