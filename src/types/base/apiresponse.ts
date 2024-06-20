export type ApiResponse<T> = {
  code: number
  data: Array<T>
  message: string
}
