import Trade from "./trade"

export default interface GetGlobalSwapsListResponse {
  swapList: Array<Trade>
  count: number
}
