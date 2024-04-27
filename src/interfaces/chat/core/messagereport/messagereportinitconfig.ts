import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface MessageReportInitConfig {
  id: string
  description: string
  messageReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Maybe<Date>
  client: Client
}
