import { OperationResult } from "@urql/core"
import { User, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  SubscriptionOnUpdateUserArgs,
  User as UserGraphQL,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for a user subscription engine that allows for updating user information.
 * @interface UserSubscriptionEngine
 */
export interface UserSubscriptionEngine {
  onUpdateUser(
    id: string,
    callback: (
      response: QIError | User,
      source: OperationResult<
        { onUpdateUser: UserGraphQL },
        SubscriptionOnUpdateUserArgs & { jwt: string }
      >
    ) => void
  ): QIError | SubscriptionGarbage
}
