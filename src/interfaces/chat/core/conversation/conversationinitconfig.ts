import { Client } from "@urql/core"
import Maybe from "../../../../types/general/maybe"

export interface ConversationInitConfig {
  id: string
  name: string
  description: Maybe<string>
  imageURL: Maybe<URL>
  bannerImageURL: Maybe<URL>
  settings: Maybe<JSON>
  membersIds: Maybe<Array<Maybe<string>>>
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  lastMessageSentAt: Maybe<Date>
  ownerId: Maybe<string>
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
  client: Client
}
