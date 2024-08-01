export interface WebConversation {
  id: string
  userDid: string
  conversationId: string
  organizationId: string
  name: string
  description: string
  imageURL: URL
  bannerImageURL: URL
  settings: string
  lastMessageSentAt: Date
  createdAt: Date
  updatedAt: Date
}
