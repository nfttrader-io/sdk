import Maybe from "../../../types/general/maybe"

export interface MessageReportSchema {
  id: string
  description: string
  messageReportsId: string
  //#user
  userId: string
  createdAt: Date
  updatedAt: Maybe<Date>
}
