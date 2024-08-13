import { LocalDBConversation, LocalDBMessage } from "@src/core/app/database"
import { Conversation, Message } from "../chat"

export class Converter {
  static fromConversationToLocalDBConversation(
    conversation: Conversation,
    userDid: string,
    organizationId: string,
    isArchived: boolean
  ): LocalDBConversation {
    return {
      id: conversation.id,
      userDid,
      organizationId,
      name: conversation.name,
      description: conversation.description ? conversation.description : "",
      imageURL: new URL(
        conversation.imageURL ? conversation.imageURL : ""
      ).toString(),
      bannerImageURL: new URL(
        conversation.bannerImageURL ? conversation.bannerImageURL : ""
      ).toString(),
      settings: JSON.stringify(conversation.settings),
      isArchived,
      lastMessageSentAt: conversation.lastMessageSentAt,
      lastMessageRead: null,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      deletedAt: null,
    }
  }

  static fromMessageToLocalDBMessage(
    message: Message | Omit<Message, "messageRoot">,
    userDid: string,
    organizationId: string,
    isImportant: boolean,
    origin: "SYSTEM" | "USER"
  ): LocalDBMessage {
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
      origin,
      messageRoot: Converter.fromMessageToLocalDBMessage(
        "messageRoot" in message ? message : message,
        userDid,
        organizationId,
        false,
        "USER"
      ),
      messageRootId: message.messageRootId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
    }
  }
}
