import Maybe from "../general/maybe"

export interface Collectible {
  contractAddress: string
  tokenId: string
  name: Maybe<string>
  description: Maybe<string>
  fileUrl: Maybe<string>
  cachedFileUrl: Maybe<string>
  creatorAddress: string
  metadata:
    | {
        attributes: Array<{
          traitType: string
          value: string
          displayType: string
        }>
        description: Maybe<string>
        externalUrl: Maybe<string>
        image: Maybe<string>
        name: Maybe<string>
      }
    | Array<{
        displayType: Maybe<string>
        maxValue: Maybe<string>
        order: Maybe<string>
        traitCount: Maybe<number>
        traitType: Maybe<string>
        value: Maybe<string>
      }>
  metadataUrl: Maybe<string>
  owner: string | string[]
  isOwner?: boolean
  amount?: string
}
