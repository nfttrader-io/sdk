import { MutedDuration } from "../../../../enums/chat"

/**
 * Interface for muting a conversation with the specified ID for a given duration.
 * @interface MuteConversationArgs
 */
export interface MuteConversationArgs {
  /**
   * @property {string} - the id of the conversation to mute.
   */
  id: string
  /**
   * @property {MutedDuration} - the timeframe in which the conversation should be muted
   */
  duration: MutedDuration
}
