import { BlacklistUserEntry } from "../../../../core/chat/blacklistuserentry"

export interface UserQueryEngine {
  blacklist: () => Promise<Array<BlacklistUserEntry>> //query
}
