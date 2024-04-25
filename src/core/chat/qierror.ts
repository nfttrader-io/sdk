import { CombinedError, ErrorLike } from "@urql/core"

//QIError stands for Query Interaction Error

export class QIError extends CombinedError {
  reason: string | null = null
  standardError: boolean = true

  constructor(
    input: {
      networkError?: Error | undefined
      graphQLErrors?: (string | ErrorLike)[] | undefined
      response?: any
    },
    reason: string,
    standardError: boolean
  ) {
    super(input)
    this.reason = reason
    this.standardError = standardError
  }
}
