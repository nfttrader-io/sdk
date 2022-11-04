import * as ethers from "ethers"
import TradeClientEventError from "./eventError"

export default interface TradeClientEventsMap {
  createSwapTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  createSwapTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  createSwapTransactionError: (
    p: TradeClientEventError<"createSwapTransactionError">
  ) => any
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
  editTakerTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  editTakerTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  editTakerTransactionError: (
    p: TradeClientEventError<"editTakerTransactionError">
  ) => any
}
