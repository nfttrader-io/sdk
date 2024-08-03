import { Maybe } from "@src/types"

export interface WebConversation {
  id: string
  userDid: string
  organizationId: string
  name: string
  description: string
  imageURL: URL
  bannerImageURL: URL
  settings: string
  isArchived: boolean
  lastMessageSentAt: Maybe<Date>
  createdAt: Date
  updatedAt: Maybe<Date>
}
