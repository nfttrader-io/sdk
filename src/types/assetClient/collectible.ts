import Maybe from "../general/maybe"
import Collection from "../postClient/collection"

export interface Collectible {
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
    size: Maybe<number>
    originalUrl: Maybe<string>
  }
  raw: {
    tokenUri: Maybe<string>
    metadata: Maybe<{
      name: Maybe<string>
      image: Maybe<string>
      attributes: Array<any>
    }>
    error: any
  }
  timeLastUpdated: Maybe<string>
  balance: Maybe<string>
  acquiredAt: {
    blockTimestamp: Maybe<string> | Maybe<number>
    blockNumber: Maybe<string> | Maybe<number>
  }
  collection?: {
    name: Maybe<string>
    openSeaSlug: Maybe<string>
    externalUrl: Maybe<string>
    bannerImageUrl: Maybe<string>
  }
  nfttraderCollection?: Collection
  isOwner?: boolean
}
