import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"
import { User } from "../../../../core/chat"

export interface BlacklistUserEntryInitConfig {
  id: string
  createdAt: Date
  blockerId: string
  blockedId: string
  blockedUser: Maybe<User>
  client: Client
}
