import {
  AddGroupFrom,
  ReceiveMessageFrom,
  UserOnlineStatus,
} from "../../../../enums/chat"

/**
 * type for updating user settings.
 * @type UpdateUserArgs
 */
export type UpdateUserArgs = {
  /**
   * @property {boolean} allowNotification - Whether to allow notifications.
   */
  allowNotification: boolean
  /**
   * @property {boolean} allowNotificationSound - Whether to allow notification sounds.
   */
  allowNotificationSound: boolean
  /**
   * @property {boolean} visibility - The visibility status of the user.
   */
  visibility: boolean
  /**
   * @property {UserOnlineStatus} onlineStatus - The online status of the user.
   */
  onlineStatus: UserOnlineStatus
  /**
   * @property {boolean} allowReadReceipt - Whether to allow read receipts.
   */
  allowReadReceipt: boolean
  /**
   * @property {ReceiveMessageFrom} allowReceiveMessageFrom - Who can send messages to the user.
   */
  allowReceiveMessageFrom: ReceiveMessageFrom
  /**
   * @property {AddGroupFrom} allowAddToGroupsFrom - Who can add the user to groups.
   */
  allowAddToGroupsFrom: AddGroupFrom
  /**
   * @property {boolean} allowGroupsSuggestion - Whether to
   */
  allowGroupsSuggestion: boolean
}
