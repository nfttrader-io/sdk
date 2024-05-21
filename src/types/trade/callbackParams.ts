/**
 * Defines a type `CallbackParams` that extracts the parameter type from a given callback function type.
 * If the parameter type is a record with string keys, it returns that parameter type; otherwise, it returns `never`.
 */
type CallbackParams<F extends (p: any) => any> = F extends (
  p: infer Param
) => any
  ? Param extends Record<string, any>
    ? Param
    : never
  : never

export default CallbackParams
