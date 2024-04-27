import Maybe from "../../../types/general/maybe"

export interface MessageReportSchema {
  id: string
  description: string
  //#user
  userId: Maybe<string>
  createdAt: Date
}
