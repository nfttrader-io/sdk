import { Auth } from "@src/auth"
import { Loopz } from "@src/loopz"
import { Oracle } from "@src/oracle"
import { Post } from "@src/post"
import { Trade } from "@src/trade"

export interface ILoopzContext {
  loopz: Loopz
  auth: Auth
  trade: Trade
  post: Post
  oracle: Oracle
}
