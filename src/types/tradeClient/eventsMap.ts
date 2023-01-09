import { TransactionMethods } from "@opensea/seaport-js/lib/types"
import * as ethers from "ethers"
import TradeClientEventError from "./eventError"

export default interface TradeClientEventsMap {
  cancelSwapTransactionCreated: (p: { tx: TransactionMethods<boolean> }) => any
  cancelSwapTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  cancelSwapTransactionError: (
    p: TradeClientEventError<"cancelSwapTransactionError">
  ) => any
  cancelSwapError: (p: TradeClientEventError<"cancelSwapError">) => any
  execSwapTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  execSwapTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  execSwapTransactionError: (
    p: TradeClientEventError<"execSwapTransactionError">
  ) => any
  execSwapError: (p: TradeClientEventError<"execSwapError">) => any
}
