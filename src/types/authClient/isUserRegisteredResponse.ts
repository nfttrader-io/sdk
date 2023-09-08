import Maybe from "../general/maybe"

export default interface IsUserRegisteredResponse {
  data: Array<{
    nonce: Maybe<string>
  }>
}
