import Maybe from "../general/maybe"

export type Credentials = {
  address: Maybe<string>
  email: Maybe<string>
  password: Maybe<string>
}
