type CallbackParams<F extends (p: any) => any> = F extends (
  p: infer Param
) => any
  ? Param extends Record<string, any>
    ? Param
    : never
  : never

export default CallbackParams
