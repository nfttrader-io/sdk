import TradeClientEventsMap from "../types/tradeClient/eventsMap"

export default [
  "createSwapTransactionCreated",
  "createSwapTransactionMined",
  "createSwapTransactionError",
  "cancelSwapTransactionCreated",
  "cancelSwapTransactionMined",
  "cancelSwapTransactionError",
  "cancelSwapError",
  "execSwapTransactionCreated",
  "execSwapTransactionMined",
  "execSwapTransactionError",
  "execSwapError",
  "editTakerTransactionCreated",
  "editTakerTransactionMined",
  "editTakerTransactionError",
] as Array<keyof TradeClientEventsMap>
