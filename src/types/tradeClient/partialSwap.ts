import Swap from "./swap"

type PartialSwap = Omit<Swap, "hash"> & Partial<Pick<Swap, "hash">>

export default PartialSwap
