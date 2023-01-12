import Trade from "./trade"

export default interface GetSwapListResponse {
  swapList: Array<Trade>
  count: number
}
