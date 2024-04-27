import Maybe from "../../../types/general/maybe"

export interface MessageSchema {
  id: string
  content: string
  //#conversation
  conversationId: string
  //#user
  userId: string
  //#messageRoot
  messageRootId: Maybe<string>
  //#pin
  //reactions
  //#reports
  type: "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT"
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
