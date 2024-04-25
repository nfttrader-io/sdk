import { QIError } from "../../../core/chat/qierror"
import { User } from "../../../core/chat/user"

export interface BlacklistUserEntrySchema {
  id: string
  blockedUser: () => Promise<User | QIError>
  createdAt: Date
  updatedAt: Date | null
}