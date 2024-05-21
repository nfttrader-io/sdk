/**
 * Defines a type for a SubscriptionGarbage object that contains an 'unsubscribe' function
 * and a 'uuid' string property.
 */
export type SubscriptionGarbage = {
  unsubscribe: () => void
  /**
   * @property {string} uuid - an uuid identifier.
   */
  uuid: string
}
