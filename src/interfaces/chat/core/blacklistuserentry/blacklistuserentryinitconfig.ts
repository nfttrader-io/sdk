import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface BlacklistUserEntryInitConfig {
  id: string
  createdAt: Date
  updatedAt: Maybe<Date>
  client: Client
}
