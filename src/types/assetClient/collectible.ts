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
    | {
        contract: {
          address: Maybe<string>
          name: Maybe<string>
          symbol: Maybe<string>
          totalSupply: Maybe<number>
          tokenType: Maybe<string>
          contractDeployer: Maybe<string>
          deployedBlockNumber: Maybe<number>
          openSeaMetadata: {
            floorPrice: Maybe<number> | Maybe<string>
            collectionName: Maybe<string>
            collectionSlug: Maybe<string>
            safelistRequestStatus: Maybe<string>
            imageUrl: Maybe<string>
            description: Maybe<string>
            externalUrl: Maybe<string>
            twitterUsername: Maybe<string>
            discordUrl: Maybe<string>
            bannerImageUrl: Maybe<string>
            lastIngestedAt: Maybe<string>
          }
          isSpam: boolean
          spamClassifications: Array<string>
        }
        tokenId: string
        tokenType: string
        name: Maybe<string>
        description: Maybe<string>
        tokenUri: Maybe<string>
        image: {
          cachedUrl: Maybe<string>
          thumbnailUrl: Maybe<string>
          pngUrl: Maybe<string>
          contentType: Maybe<string>
          size: Maybe<string>
          originalUrl: Maybe<string>
        }
        raw: {
          tokenUri: Maybe<string>
          metadata: any
          error: any
        }
        timeLastUpdated: Maybe<string>
        balance: Maybe<string>
        acquiredAt: {
          blockTimestamp: Maybe<string> | Maybe<number>
          blockNumber: Maybe<string> | Maybe<number>
        }
      }
  metadataUrl: Maybe<string>
  owner: string | string[]
  isOwner?: boolean
  amount?: string
}
