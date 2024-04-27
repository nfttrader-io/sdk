import Maybe from "../../../types/general/maybe"

export interface BlacklistUserEntrySchema {
  id: string
  createdAt: Date
  updatedAt: Maybe<Date>
}
