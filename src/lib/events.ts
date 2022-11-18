import TradeClientEventsMap from "../types/tradeClient/eventsMap"

export default [
  "createSwapTransactionCreated",
  "createSwapTransactionMined",
  "createSwapTransactionError",
  "cancelSwapTransactionCreated",
  "cancelSwapTransactionMined",
  "cancelSwapTransactionError",
  "closeSwapTransactionCreated",
  "closeSwapTransactionMined",
  "closeSwapTransactionError",
  "editTakerTransactionCreated",
  "editTakerTransactionMined",
  "editTakerTransactionError",
] as Array<keyof TradeClientEventsMap>
