import { EngineInitConfig } from "../../interfaces/chat/core"
import { ReactionInitConfig } from "../../interfaces/chat/core/reaction"
import { ReactionSchema } from "../../interfaces/chat/schema/reaction"
import { Engine } from "./engine"

export class Reaction extends Engine implements ReactionSchema {
  readonly content: string
  readonly createdAt: Date
  readonly userId: string

  constructor(config: ReactionInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
      userKeyPair: config.userKeyPair,
      keyPairsMap: config.keyPairsMap,
    })
    this.content = config.content
    this.createdAt = config.createdAt
    this.userId = config.userId
    this._client = config.client
  }
}
