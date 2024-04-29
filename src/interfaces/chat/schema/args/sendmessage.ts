import { MessageType } from "../../../../enums/chat/messagetype"

export interface SendMessageArgs {
  conversationId: string
  content: string
  type: MessageType
}
