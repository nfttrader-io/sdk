import { User } from "./core/chat/user"
import { QIError } from "./core/chat/qierror"
import { Engine } from "./core/chat/engine"
import { UserQueryEngine } from "./interfaces/chat/core/user/queryengine"

import { BlacklistUserEntry } from "./core/chat/blacklistuserentry"

export default class Chat extends Engine implements UserQueryEngine {
  async blockUser(): Promise<User | QIError> {
    return new Promise(() => {})
  }
  async blacklist(): Promise<BlacklistUserEntry[]> {
    return new Promise(() => {})
  }

  async test(): Promise<Conversation | QIError> {}
}
