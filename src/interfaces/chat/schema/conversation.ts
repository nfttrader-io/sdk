import Maybe from "../../../types/general/maybe"

export interface ConversationSchema {
  id: string
  name: string
  description: Maybe<string>
  imageURL: Maybe<URL>
  bannerImageURL: Maybe<URL>
  //#members
  //#messages
  //#reports
  settings: Maybe<JSON>
  //#mutedBy
  membersIds: Maybe<Array<Maybe<string>>>
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  lastMessageSentAt: Maybe<Date>
  ownerId: Maybe<string>
  //#owner
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
