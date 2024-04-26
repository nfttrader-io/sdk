import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface ConversationReportInitConfig {
  id: string
  description: string
  conversationReportsId: string
  userId: string
  createdAt: Date
  updatedAt: Maybe<Date>
  client: Client
}
