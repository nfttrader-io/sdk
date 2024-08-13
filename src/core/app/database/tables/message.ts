import { Maybe } from "@src/types"

export interface LocalDBMessage {
  id: string //primary key
  userDid: string //primary key
  userId: string
  organizationId: string
  conversationId: string
  content: string
  reactions: Maybe<Array<{ content: string; userId: string; createdAt: Date }>>
  isImportant: boolean
  type:
    | "TEXTUAL"
    | "ATTACHMENT"
    | "NFT"
    | "SWAP_PROPOSAL"
    | "RENT"
    | "EJECTED"
    | "LEFT"
  origin: "SYSTEM" | "USER"
  messageRoot: Maybe<LocalDBMessage>
  messageRootId: Maybe<string>
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
