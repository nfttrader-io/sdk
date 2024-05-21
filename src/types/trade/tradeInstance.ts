import { OrderWithCounter } from "@opensea/seaport-js/lib/types"
/**
 * Represents a trade instance which extends the OrderWithCounter type from the @opensea/seaport-js library.
 * It includes an additional property 'hash' of type string.
 */
type TradeInstance = OrderWithCounter & { hash: string }

export default TradeInstance
