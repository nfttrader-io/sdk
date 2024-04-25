import { User } from "./core/chat/user"
import { QIError } from "./core/chat/qierror"
import { QueryEngine } from "./core/chat/queryengine"
import { UserEngine } from "./interfaces/chat/core/userengine"
import { BlacklistUserEntry } from "./core/chat/blacklistuserentry"

export default class Chat extends QueryEngine implements UserEngine {
  async blockUser(): Promise<User | QIError> {
    return new Promise(() => {})
  }
  async blacklist(): Promise<BlacklistUserEntry[]> {
    return new Promise(() => {})
  }
}
