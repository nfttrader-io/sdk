import { Client } from "@urql/core"

export interface ReactionInitConfig {
  content: string
  createdAt: Date
  userId: string
  client: Client
}
