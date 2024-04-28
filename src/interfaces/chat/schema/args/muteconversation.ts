import { MutedDuration } from "../../../../enums/chat"

export interface MuteConversationArgs {
  id: string
  duration: MutedDuration
}
