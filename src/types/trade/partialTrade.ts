import Trade from "./tradeInstance"

type PartialTrade = Omit<Trade, "hash"> & Partial<Pick<Trade, "hash">>

export default PartialTrade
