import Trade from "./trade"

export default interface GetUserSwapsListResponse {
  swapList: Array<Trade>
  count: number
}
