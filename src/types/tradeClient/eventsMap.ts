import * as ethers from "ethers"
import TradeClientEventError from "./eventError"

export default interface TradeClientEventsMap {
  cancelSwapTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  cancelSwapTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  cancelSwapTransactionError: (
    p: TradeClientEventError<"cancelSwapTransactionError">
  ) => any
  closeSwapTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  closeSwapTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  closeSwapTransactionError: (
    p: TradeClientEventError<"closeSwapTransactionError">
  ) => any
}
