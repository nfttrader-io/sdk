import { WebConversation, WebMessage } from "@src/interfaces/app/core/database"
import { Conversation, Message } from "../chat"

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
      deletedAt: null,
    }
  }

  static fromMessageToWebMessage(
    message: Message | Omit<Message, "messageRoot">,
    userDid: string,
    organizationId: string,
    isImportant: boolean
  ): WebMessage {
    return {
      id: message.id,
      userId: message.userId,
      userDid,
      organizationId,
      conversationId: message.conversationId,
      content: message.content,
      reactions: message.reactions
        ? message.reactions.map((reaction) => {
            return {
              content: reaction.content,
              userId: reaction.userId,
              createdAt: reaction.createdAt,
            }
          })
        : [],
      isImportant,
      type: message.type!,
      messageRoot: Converter.fromMessageToWebMessage(
        "messageRoot" in message ? message : message,
        userDid,
        organizationId,
        false
      ),
      messageRootId: message.messageRootId,
      createdAt: message.createdAt,
      updateAt: message.updatedAt,
      deletedAt: message.deletedAt,
    }
  }
}
