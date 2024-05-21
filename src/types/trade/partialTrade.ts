import Trade from "./tradeInstance"
/**
 * Represents a partial trade instance without the 'hash' property.
 * @extends Trade
 */
type PartialTrade = Omit<Trade, "hash"> & Partial<Pick<Trade, "hash">>

export default PartialTrade
