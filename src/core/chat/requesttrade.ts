import { RequestTrade as IRequestTrade } from "../../interfaces/chat/requesttrade"

export interface RequestTradeInitConfig {
  id: string
  conversationId: string
  createdAt: Date
  creatorsIds: string[]
  initializatorsIds: string[]
  deletedAt: Date | null
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "RENT" | "TRADE"
  updatedAt: Date | null
  userId: string
}

export class RequestTrade implements IRequestTrade {
  id: string
  conversationId: string
  createdAt: Date
  creatorsIds: string[]
  initializatorsIds: string[]
  deletedAt: Date | null
  operation: JSON
  status:
    | "TRADE_INITIALIZED"
    | "TRADE_CONFIRMED"
    | "TRADE_PROGRESS"
    | "TRADE_COMPLETED"
  type: "RENT" | "TRADE"
  updatedAt: Date | null
  userId: string

  constructor(config: RequestTradeInitConfig) {
    this.id = config.id
    this.conversationId = config.conversationId
    this.createdAt = config.createdAt
    this.creatorsIds = config.creatorsIds
    this.initializatorsIds = config.initializatorsIds
    this.deletedAt = config.deletedAt
    this.operation = config.operation
    this.status = config.status
    this.type = config.type
    this.updatedAt = config.updatedAt
    this.userId = config.userId
  }
}
