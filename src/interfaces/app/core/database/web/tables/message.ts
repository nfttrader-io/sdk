import { Maybe } from "@src/types"

export interface WebMessage {
  id: string //primary key
  userId: string
  organizationId: string
  userDid: string
  conversationId: string
  content: string
  reactions: Array<{ content: string; userId: string; createdAt: Date }>
  isImportant: boolean
  type: "TEXTUAL" | "ATTACHMENT" | "NFT" | "SWAP_PROPOSAL" | "RENT"
  messageRoot: Maybe<WebMessage>
  messageRootId: Maybe<string>
  createdAt: Date
  updateAt: Date
  deletedAt: Date
}
