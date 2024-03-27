import { TransactionMethods } from "@opensea/seaport-js/lib/types"
import * as ethers from "ethers"
import TradeClientEventError from "./eventError"

export default interface TradeEvents {
  cancelTradeTransactionCreated: (p: { tx: TransactionMethods<boolean> }) => any
  cancelTradeTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  cancelTradeTransactionError: (
    p: TradeClientEventError<"cancelTradeTransactionError">
  ) => any
  cancelTradeError: (p: TradeClientEventError<"cancelTradeError">) => any
  execTradeTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  execTradeTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  execTradeTransactionError: (
    p: TradeClientEventError<"execTradeTransactionError">
  ) => any
  execTradeError: (p: TradeClientEventError<"execTradeError">) => any
}
