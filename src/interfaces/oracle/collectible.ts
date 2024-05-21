import { Maybe } from "../../types/base"
import { Collection } from "../post"

/**
 * Interface representing a collectible item with various properties.
 * @interface Collectible
 */
export interface Collectible {
  /**
   * @property {object} contract - Information about the contract of the collectible.
   */
  contract: {
    /**
     * @property {string} contract.address - The address of the contract.
     */
    address: Maybe<string>
    /**
     * @property {string} contract.name - The name of the contract.
     */
    name: Maybe<string>
    /**
     * @property {string} contract.symbol - The symbol of the contract.
     */
    symbol: Maybe<string>
    /**
     * @property {number} contract.totalSupply - The total supply of the contract.
     */
    totalSupply: Maybe<number>
    /**
     * @property {string} contract.tokenType - The type of token.
     */
    tokenType: Maybe<string>
    /**
     * @property {string} contract.contractDeployer - The deployer of the contract.
     */
    contractDeployer: Maybe<string>
    /**
     * @property {number} contract.deployedBlockNumber - The block number at which the contract was
     */
    deployedBlockNumber: Maybe<number>
    /**
     * @property {object} openSeaMetadata - Metadata specific to OpenSea tokens.
     */
    openSeaMetadata: {
      /**
       * @property {number | string} openSeaMetadata.floorPrice - The floor price of the token.
       */
      floorPrice: Maybe<number | string>
      /**
       * @property {string} openSeaMetadata.collectionName - The name of the collection.
       */
      collectionName: Maybe<string>
      /**
       * @property {string} openSeaMetadata.collectionSlug - The slug of the collection.
       */
      collectionSlug: Maybe<string>
      /**
       * @property {string} openSeaMetadata.safelistRequestStatus - The safelist request status.
       */
      safelistRequestStatus: Maybe<string>
      /**
       * @property {string} openSeaMetadata.imageUrl - The URL of the image.
       */
      imageUrl: Maybe<string>
      /**
       * @property {string} openSeaMetadata.description - The description of the token.
       */
      description: Maybe<string>
      /**
       * @property {string} openSeaMetadata.externalUrl - The OS externarl url
       */
      externalUrl: Maybe<string>
      /**
       * @property {Maybe<string>} twitterUsername - The user's Twitter username.
       */
      twitterUsername: Maybe<string>
      /**
       *@property {Maybe<string>} discordUrl - The user's Discord URL.
       */
      discordUrl: Maybe<string>
      /**
       *@property {Maybe<string>} bannerImageUrl - The URL of the user's banner image.
       */
      bannerImageUrl: Maybe<string>
      /**
       *@property {Maybe<string>} lastIngestedAt - The timestamp of the last data ingestion.
       */
      lastIngestedAt: Maybe<string>
    }
    /**
     * @property {boolean} isSpam - Indicates whether the content is classified as spam.
     */
    isSpam: boolean
    /**
     * @property {Array<string>} spamClassifications - An array of spam classifications assigned to the content.
     */
    spamClassifications: Array<string>
  }
  /**
   * @property {string} tokenId - The unique identifier of the token.
   */
  tokenId: string
  /**
   * @property {string} tokenType - The type of the token.
   */
  tokenType: string
  /**
   * @property {string | null} [name=null] - The name of the token, if available.
   */
  name: Maybe<string>
  /**
   * @property {string | null} [description=null] - The description of the token, if available.
   */
  description: Maybe<string>
  /**
   * @property {string | null} [tokenUri=null] - The URI of the token, if available.
   */
  tokenUri: Maybe<string>
  /**
   * @property {object} image - Represents an image object with various properties.
   */
  image: {
    /**
     * @property {Maybe<string>} cachedUrl - The cached URL of the image.
     */
    cachedUrl: Maybe<string>
    /**
     * @property {Maybe<string>} thumbnailUrl - The URL of the thumbnail image.
     */
    thumbnailUrl: Maybe<string>
    /**
     * @property {Maybe<string>} pngUrl - The URL of the PNG version of the image.
     */
    pngUrl: Maybe<string>
    /**
     * @property {Maybe<string>} contentType - The content type of the image.
     */
    contentType: Maybe<string>
    /**
     * @property {Maybe<number>} size - The size of the image.
     */
    size: Maybe<number>
    /**
     * @property {Maybe<string>} originalUrl - The original URL of the image.
     */
    originalUrl: Maybe<string>
  }
  /**
   * @property {any} raw - The raw object.
   */
  raw: {
    /**
     * @property {Maybe<string>} tokenUri - The token URI, possibly undefined.
     */
    tokenUri: Maybe<string>
    /**
     * @property {Maybe<{ name: Maybe<string>, image: Maybe<string>, attributes: Array<any> }>} metadata - The metadata object containing name, image, and attributes.
     */
    metadata: Maybe<{
      name: Maybe<string>
      image: Maybe<string>
      attributes: Array<any>
    }>
    /**
     * @property {any} error - The error object.
     */
    error: any
  }
  /**
   * @property {Maybe<string>} timeLastUpdated - Represents a nullable string value that may or may not be present.
   */
  timeLastUpdated: Maybe<string>
  /**
   * @property {Maybe<string>} balance - Represents a value that may or may not be present.
   */
  balance: Maybe<string>
  /**
   * @property {object} acquiredAt - represent an object of information related to the acquisition of the collectible.
   */
  acquiredAt: {
    /**
     * @property {string | number | null} blockTimestamp - The timestamp of the block.
     */
    blockTimestamp: Maybe<string | number>
    /**
     * @property {string | number | null} blockNumber - The number of the block.
     */
    blockNumber: Maybe<string | number>
  }
  /**
   * @property {object} [collection] - Represents a collection with optional properties.
   */
  collection?: {
    /**
     * @property {Maybe<string>} name - The name of the collection.
     */
    name: Maybe<string>
    /**
     * @property {Maybe<string>} openSeaSlug - The OpenSea slug of the collection.
     */
    openSeaSlug: Maybe<string>
    /**
     * @property {Maybe<string>} externalUrl - The external URL of the collection.
     */
    externalUrl: Maybe<string>
    /**
     * @property {Maybe<string>} bannerImageUrl - The banner image URL of the collection.
     */
    bannerImageUrl: Maybe<string>
  }
  /**
   * @property {Collection} nfttraderCollection - Represents a collection of NFTs shaped in the NFT Trader format.
   */
  nfttraderCollection?: Collection
  /**
   * @property {boolean} isOwner - Indicates if the user is the owner of the NFTs.
   */
  isOwner?: boolean
  /**
   * @property {Array<string> | string} owner - The owner(s) of the NFTs.
   */
  owner?: Array<string> | string
}
