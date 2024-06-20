import { MutedDuration } from "../../../../enums/chat"

/**
 * type for muting a conversation with the specified ID for a given duration.
 * @type MuteConversationArgs
 */
export type MuteConversationArgs = {
  /**
   * @property {string} - the id of the conversation to mute.
   */
  id: string
  /**
   * @property {MutedDuration} - the timeframe in which the conversation should be muted
   */
  duration: MutedDuration
}
