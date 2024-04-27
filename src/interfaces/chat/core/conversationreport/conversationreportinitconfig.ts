import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface ConversationReportInitConfig {
  id: string
  description: Maybe<string>
  userId: Maybe<string>
  createdAt: Date
  client: Client
}
