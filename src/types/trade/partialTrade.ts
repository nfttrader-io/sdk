import { TradeInstance } from "./tradeinstance"
/**
 * Represents a partial trade instance without the 'hash' property.
 * @extends Trade
 */
type PartialTrade = Omit<TradeInstance, "hash"> &
  Partial<Pick<TradeInstance, "hash">>

export { PartialTrade }
