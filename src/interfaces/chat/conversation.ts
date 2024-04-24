export interface Conversation {
  id: string
  name: string
  description: string
  imageURL: URL
  bannerImageURL: URL
  //#members
  //#messages
  //#reports
  settings: JSON
  //#mutedBy
  membersIds: Array<string>
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  lastMessageSentAt: Date | null
  ownerId: string
  //#owner
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}
