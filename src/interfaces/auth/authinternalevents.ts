import { AuthEvents } from "@src/types"

export interface AuthInternalEvents {
  on(eventName: AuthEvents, callback: Function): void
  _emit(eventName: AuthEvents, params?: any): void
}
