import { OrderWithCounter } from "@opensea/seaport-js/lib/types"

type Trade = OrderWithCounter & { hash: string }

export default Trade
