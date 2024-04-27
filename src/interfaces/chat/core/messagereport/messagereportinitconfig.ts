import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface MessageReportInitConfig {
  id: string
  description: string
  userId: Maybe<string>
  createdAt: Date
  client: Client
}
