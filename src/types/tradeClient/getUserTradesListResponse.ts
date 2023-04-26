import TradeOrder from "./tradeOrder"

export default interface GetUserTradesListResponse {
  tradeList: Array<TradeOrder>
  count: number
}
