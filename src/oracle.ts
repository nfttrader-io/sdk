import { HTTPClient } from "./core/httpclient"
import {
  OracleConfig,
  GetCollectionsParamsSearch,
  GetNFTsParamsSearch,
  GetNFTParamsSearch,
} from "./types/oracle"
import {
  CollectionSupported,
  CollectionsAdded,
  GetCollectionsResponse,
  GetNFTsResponse,
  GetNFTResponse,
} from "./interfaces/oracle"
import { HTTPRequestInit, HTTPResponse } from "./interfaces/base"
import { ApiKeyAuthorized, Maybe } from "./types/base"

/**
 * Represents an Oracle class that extends HTTPClient and provides methods to interact with an Oracle API.
 * @class Oracle
 * @extends HTTPClient
 */
export class Oracle extends HTTPClient {
  /**
   * @property {Maybe<string>} _apiKey - Private property to store an API key, which may be a string or null.
   */
  private _apiKey: Maybe<string> = null
  /**
   * @property {string} _BACKEND_URL - Private property to store an API key, which may be a string or null.
   */
  private _BACKEND_URL: string = "https://api.nfttrader.io"

  /**
   * Constructor for creating an instance of a class that requires an API key for authorization.
   * @param {ApiKeyAuthorized} config - The configuration object containing the API key.
   * @returns None
   */
  constructor(config: ApiKeyAuthorized) {
    super()
    this._apiKey = config.apiKey
  }

  /**
   * Validates each address in the given array of collections to ensure they are in the correct format.
   * @param {string[]} collections - An array of Ethereum addresses to validate.
   * @throws {Error} Throws an error if any address in the array is not in the correct format.
   */
  private _validate(collections: string[]) {
    let ok: boolean = true
    let i = 0

    while (i < collections.length) {
      ok = /^0x[a-fA-F0-9]{40}$/.test(collections[i])
      if (!ok) break
      i++
    }

    if (!ok)
      throw new Error(
        "An address of the set you provided is not in the right format. Please provide a valid Ethereum address."
      )
  }

  /**
   * Makes a fetch request with authentication headers.
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} [options] - The options for the fetch request.
   * @returns {Promise<HTTPResponse<ReturnType>>} A promise that resolves to the HTTP response.
   */
  private _fetchWithAuth<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    }
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      "x-api-key": `${this._apiKey}`,
    }

    return this._fetch(url, options)
  }

  /**
   * Retrieves collections based on the provided search parameters.
   * @param {GetCollectionsParamsSearch} params - The search parameters for fetching collections.
   * @returns {Promise<Maybe<GetCollectionsResponse>>} A promise that resolves to the collections response or null.
   * @throws {Error} If an error occurs during the fetching process.
   */
  async getCollections(
    params: GetCollectionsParamsSearch
  ): Promise<Maybe<GetCollectionsResponse>> {
    const url: string = `${this._BACKEND_URL}/collections/getCollections/${
      params.networkId ? params.networkId : `*`
    }/${params.userAddress}/${params.searchType}/${params.skip}/${params.take}${
      params.queryString ? `/${params.queryString}` : ``
    }`

    try {
      const { data } = await this._fetchWithAuth<GetCollectionsResponse>(url)

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Retrieves NFTs based on the provided search parameters.
   * @param {GetNFTsParamsSearch} params - The search parameters for fetching NFTs.
   * @returns {Promise<Maybe<GetNFTsResponse>>} A promise that resolves to the response containing the NFTs, or null if no data is returned.
   * @throws {Error} If an error occurs during the fetch operation.
   */
  async getNFTs(params: GetNFTsParamsSearch): Promise<Maybe<GetNFTsResponse>> {
    const url: string = `${this._BACKEND_URL}/metadata/getNFTsByOwner/${
      params.networkId
    }/${params.address}/${params.take}${
      params.continuation ? `/${params.continuation}` : ``
    }`

    try {
      const { data } = await this._fetchWithAuth<GetNFTsResponse>(url, {
        method: "POST",
        body: {
          collections: params.collections ? params.collections : null,
        },
      })

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Retrieves NFT metadata based on the provided search parameters.
   * @param {GetNFTParamsSearch} params - The search parameters for the NFT.
   * @returns {Promise<Maybe<GetNFTResponse>>} A promise that resolves to the NFT metadata response, or null if no data is found.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  async getNFT(params: GetNFTParamsSearch): Promise<Maybe<GetNFTResponse>> {
    const url: string = `${this._BACKEND_URL}/metadata/getNftMetadata/${
      params.networkId
    }/${params.collectionAddress}/${params.tokenId}${
      params.address ? `/${params.address}` : ``
    }`

    try {
      const { data } = await this._fetchWithAuth<GetNFTResponse>(url, {
        method: "GET",
      })

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Adds collections to the backend server.
   * @param {Array<{ address: string; networkId: string }>} collections - An array of objects containing address and networkId.
   * @returns {Promise<Maybe<Array<CollectionsAdded>>>} A promise that resolves to an array of added collections, or null if no data is returned.
   * @throws {Error} If an error occurs during the process.
   */
  async addCollections(
    collections: Array<{ address: string; networkId: string }>
  ): Promise<Maybe<Array<CollectionsAdded>>> {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { data } = await this._fetchWithAuth<Array<CollectionsAdded>>(
        `${this._BACKEND_URL}/collections/insertCollectionBulk`,
        {
          method: "POST",
          body: {
            collections,
          },
        }
      )

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Checks if a collection is supported for the given address and network ID.
   * @param {string} address - The address of the collection.
   * @param {string} networkId - The network ID of the collection.
   * @returns {Promise<Maybe<Array<CollectionSupported>>>} A promise that resolves to an array of supported collections, or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async isCollectionSupported(
    address: string,
    networkId: string
  ): Promise<Maybe<Array<CollectionSupported>>> {
    this._validate([address])

    try {
      const { data } = await this._fetchWithAuth<Array<CollectionSupported>>(
        `${this._BACKEND_URL}/collections/isCollectionSupported/${address}/${networkId}`,
        {
          method: "GET",
        }
      )
      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Checks if the given collections are supported by the backend server.
   * @param {Array<{ address: string; networkId: string }>} collections - An array of collection objects containing address and networkId.
   * @returns {Promise<Maybe<Array<CollectionSupported>>>} A promise that resolves to an array of supported collections or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async collectionsSupported(
    collections: Array<{ address: string; networkId: string }>
  ): Promise<Maybe<Array<CollectionSupported>>> {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { data } = await this._fetchWithAuth<Array<CollectionSupported>>(
        `${this._BACKEND_URL}/collections/isCollectionSupportedBulk`,
        {
          method: "POST",
          body: {
            collections,
          },
        }
      )

      return data ?? null
    } catch (e) {
      throw e
    }
  }

  /**
   * Sets the backend URL in the Oracle configuration.
   * @param {OracleConfig} config - The Oracle configuration object containing the backend URL.
   * @returns None
   */
  config(config: OracleConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
  }
}
