import { TransactionMethods } from "@opensea/seaport-js/lib/types"
import * as ethers from "ethers"
import { TradeEventError } from "./tradeeventerror"

/**
 * Interface defining trade events with various methods related to trade transactions.
 * @interface TradeEvents
 */
export interface TradeEvents {
  cancelTradeTransactionCreated: (p: { tx: TransactionMethods<boolean> }) => any
  cancelTradeTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  cancelTradeTransactionError: (
    p: TradeEventError<"cancelTradeTransactionError">
  ) => any
  cancelTradeError: (p: TradeEventError<"cancelTradeError">) => any
  execTradeTransactionCreated: (p: {
    tx: ethers.providers.TransactionResponse
  }) => any
  execTradeTransactionMined: (p: {
    receipt: ethers.providers.TransactionReceipt
  }) => any
  execTradeTransactionError: (
    p: TradeEventError<"execTradeTransactionError">
  ) => any
  execTradeError: (p: TradeEventError<"execTradeError">) => any
}
