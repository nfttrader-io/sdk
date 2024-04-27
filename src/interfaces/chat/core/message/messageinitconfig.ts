import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface MessageInitConfig {
  id: string
  content: string
  conversationId: Maybe<string>
  userId: Maybe<string>
  messageRootId: Maybe<string>
  type: Maybe<"TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT">
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
  client: Client
}
