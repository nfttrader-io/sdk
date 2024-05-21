import { TradeEvents } from "../../interfaces/trade"

export default [
  "cancelTradeTransactionCreated",
  "cancelTradeTransactionMined",
  "cancelTradeTransactionError",
  "cancelTradeError",
  "execTradeTransactionCreated",
  "execTradeTransactionMined",
  "execTradeTransactionError",
  "execTradeError",
] as Array<keyof TradeEvents>
