import { EngineInitConfig } from "../../interfaces/chat/core"
import { ConversationQueryEngine } from "../../interfaces/chat/core/conversation"
import { ConversationInitConfig } from "../../interfaces/chat/core/conversation/conversationinitconfig"
import { ConversationSchema } from "../../interfaces/chat/schema"
import Maybe from "../../types/general/maybe"
import { Engine } from "./engine"
import { QIError } from "./qierror"
import { User } from "./user"

export class Conversation
  extends Engine
  implements ConversationSchema, ConversationQueryEngine
{
  id: string
  name: string
  description: Maybe<string>
  imageURL: Maybe<URL>
  bannerImageURL: Maybe<URL>
  settings: Maybe<JSON>
  membersIds: Maybe<Array<Maybe<string>>>
  type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  lastMessageSentAt: Maybe<Date>
  ownerId: Maybe<string>
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>

  constructor(config: ConversationInitConfig & EngineInitConfig) {
    super({
      jwtToken: config.jwtToken,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      realtimeApiUrl: config.realtimeApiUrl,
    })

    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.imageURL = config.imageURL
    this.bannerImageURL = config.bannerImageURL
    this.settings = config.settings
    this.membersIds = config.membersIds
    this.type = config.type
    this.lastMessageSentAt = config.lastMessageSentAt
    this.ownerId = config.ownerId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt

    this._client = config.client
  }

  owner(): Promise<User | QIError> {
    return new Promise(() => {})
  }
}
