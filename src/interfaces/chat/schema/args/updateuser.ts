import {
  AddGroupFrom,
  ReceiveMessageFrom,
  UserOnlineStatus,
} from "../../../../enums/chat"

export interface UpdateUserArgs {
  allowNotification: boolean
  allowNotificationSound: boolean
  visibility: boolean
  onlineStatus: UserOnlineStatus
  allowReadReceipt: boolean
  allowReceiveMessageFrom: ReceiveMessageFrom
  allowAddToGroupsFrom: AddGroupFrom
  allowGroupsSuggestion: boolean
}
