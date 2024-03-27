import TradeOrder from "./tradeOrder"

export default interface UserTradesListResponse {
  tradeList: Array<TradeOrder>
  count: number
}
