import { ActiveUserConversationType } from "../../../../enums/chat"

export interface ListAllActiveUserConversationIdsArgs {
  type: ActiveUserConversationType
  nextToken: string
}
