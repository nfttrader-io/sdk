import { Maybe } from "@src/types"

export interface LocalDBConversation {
  id: string //primary key
  userDid: string //primary key
  organizationId: string
  name: string
  description: string
  imageURL: string
  bannerImageURL: string
  settings: string
  isArchived: boolean
  lastMessageSentAt: Maybe<Date>
  lastMessageRead: Maybe<Date>
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
