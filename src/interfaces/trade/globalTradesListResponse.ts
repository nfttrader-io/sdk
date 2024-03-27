import TradeOrder from "./tradeOrder"

export default interface GlobalTradesListResponse {
  tradeList: Array<TradeOrder>
  count: number
}
