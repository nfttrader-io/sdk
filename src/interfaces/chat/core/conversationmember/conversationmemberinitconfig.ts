import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface ConversationMemberInitConfig {
  id: string
  conversationId: Maybe<string>
  userId: string
  type: "USER" | "ADMINISTRATOR"
  encryptedConversationPublicKey: string
  encryptedConversationPrivateKey: string
  createdAt: Maybe<Date>
  client: Client
}
