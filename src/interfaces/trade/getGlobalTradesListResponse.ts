import TradeOrder from "./tradeOrder"

export default interface GetGlobalTradesListResponse {
  tradeList: Array<TradeOrder>
  count: number
}
