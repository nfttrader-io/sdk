import { OrderWithCounter } from "@opensea/seaport-js/lib/types"

type TradeInstance = OrderWithCounter & { hash: string }

export default TradeInstance
