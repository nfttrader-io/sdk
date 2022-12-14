import { OrderWithCounter } from "@opensea/seaport-js/lib/types"

type Swap = OrderWithCounter & { hash: string }

export default Swap
