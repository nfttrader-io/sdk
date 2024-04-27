import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationMemberInitConfig } from "../../interfaces/chat/core/conversationmember"
import { ConversationMemberSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"

export class ConversationMember
  extends Engine
  implements ConversationMemberSchema
{
  readonly id: string
  readonly conversationId: Maybe<string>
  readonly userId: string
  readonly type: "USER" | "ADMINISTRATOR"
  readonly encryptedConversationPublicKey: string
  readonly encryptedConversationPrivateKey: string
  readonly createdAt: Maybe<Date>

  constructor(config: ConversationMemberInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.conversationId = config.conversationId
    this.userId = config.userId
    this.type = config.type
    this.encryptedConversationPrivateKey =
      config.encryptedConversationPrivateKey
    this.encryptedConversationPublicKey = config.encryptedConversationPublicKey
    this.createdAt = config.createdAt
    this._client = config.client
  }
}
