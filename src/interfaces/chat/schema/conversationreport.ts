import Maybe from "../../../types/general/maybe"

export interface ConversationReportSchema {
  id: string
  description: Maybe<string>
  //#user
  userId: Maybe<string>
  createdAt: Date
}
