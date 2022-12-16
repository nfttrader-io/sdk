import Maybe from "./maybe"

export default interface HTTPResponse<DataType = any> {
  statusCode: number
  statusMessage: string
  data?: Maybe<DataType>
  error?: Error | Maybe<DataType>
  isFetchError?: boolean
}
