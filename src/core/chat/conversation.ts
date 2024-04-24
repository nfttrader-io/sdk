import { Conversation as IConversation } from "../../interfaces/chat/conversation"

export interface ConversationInitConfig {
  id: string
  name: string
  description: string
  imageURL: URL
  bannerImageURL: URL
  settings: JSON
  membersIds: string[]
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  lastMessageSentAt: Date | null
  ownerId: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export class Conversation implements IConversation {
  id: string
  name: string
  description: string
  imageURL: URL
  bannerImageURL: URL
  settings: JSON
  membersIds: string[]
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  lastMessageSentAt: Date | null
  ownerId: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null

  constructor(config: ConversationInitConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.imageURL = config.imageURL
    this.bannerImageURL = config.bannerImageURL
    this.settings = config.settings
    this.membersIds = config.membersIds
    this.type = config.type
    this.lastMessageSentAt = config.lastMessageSentAt
    this.ownerId = config.ownerId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt
  }
}
