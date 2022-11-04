import TradeClientEventsMap from "../interfaces/tradeClient/eventsMap"

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
