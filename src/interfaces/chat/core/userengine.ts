import { User } from "../../../core/chat/user"
import { QIError } from "../../../core/chat/qierror"
import { BlacklistUserEntry } from "../../../core/chat/blacklistuserentry"

export interface UserEngine {
  blockUser: () => Promise<QIError | User> //mutation
  blacklist: () => Promise<Array<BlacklistUserEntry>> //query
}
