import Maybe from "../general/maybe"

export default interface SignupResponse {
  data: Array<{
    nonce: Maybe<string>
  }>
}
