import Trade from "./trade"

type PartialTrade = Omit<Trade, "hash"> & Partial<Pick<Trade, "hash">>

export default PartialTrade
