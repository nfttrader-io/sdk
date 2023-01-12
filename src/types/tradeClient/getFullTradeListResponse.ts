import Trade from "./trade"

export default interface GetFullTradeListResponse {
  swapList: Array<Trade>
  count: number
}
