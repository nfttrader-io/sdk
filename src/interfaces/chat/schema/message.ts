export interface MessageSchema {
  id: string
  content: string
  //#conversation
  conversationId: string
  //#user
  userId: string
  //#messageRoot
  messageRootId: string | null
  //#pin
  //reactions
  //#reports
  type: "TEXTUAL" | "ATTACHMENT" | "SWAP_PROPOSAL" | "RENT"
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}
