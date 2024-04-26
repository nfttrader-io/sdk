import { QIError } from "../../../../core/chat/qierror"
import { User } from "../../../../core/chat/user"

export interface UserMutationEngine {
  blockUser(): Promise<User | QIError>
  blockUser(id: string): Promise<User | QIError>
}
