import Maybe from "../../../types/general/maybe"

export interface ConversationReportSchema {
  id: string
  description: string
  conversationReportsId: string
  //#user
  userId: string
  createdAt: Date
  updatedAt: Maybe<Date>
}
