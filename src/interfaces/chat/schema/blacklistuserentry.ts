import { User } from "../../../core/chat"
import Maybe from "../../../types/general/maybe"

export interface BlacklistUserEntrySchema {
  id: string
  createdAt: Date
  blockerId: string
  blockedId: string
  blockedUser: Maybe<User>
}
