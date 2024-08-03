import { WebConversation } from "@src/interfaces/app/core/database"
import { Conversation } from "../chat"

export class Converter {
  static fromConversationToWebConversation(
    conversation: Conversation,
    userDid: string,
    organizationId: string,
    isArchived: boolean
  ): WebConversation {
    return {
      id: conversation.id,
      userDid,
      organizationId,
      name: conversation.name,
      description: conversation.description ? conversation.description : "",
      imageURL: new URL(conversation.imageURL ? conversation.imageURL : ""),
      bannerImageURL: new URL(
        conversation.bannerImageURL ? conversation.bannerImageURL : ""
      ),
      settings: JSON.stringify(conversation.settings),
      isArchived,
      lastMessageSentAt: conversation.lastMessageSentAt,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    }
  }
}
