import GlobalFetch from "./lib/globalFetch"
import ApiKeyAuthorized from "./types/assetClient/apiKeyAuthorized"
import AssetClientConfig from "./types/assetClient/assetClientConfig"
import CollectionSupported from "./types/assetClient/collectionSupported"
import CollectionsAdded from "./types/assetClient/collectionsAdded"
import GetCollectionsResponse from "./types/assetClient/getCollectionsResponse"
import GetCollectionsParamsSearch from "./types/assetClient/getCollectionsParamsSearch"
import HTTPRequestInit from "./types/general/httpRequestInit"
import HTTPResponse from "./types/general/httpResponse"
import Maybe from "./types/general/maybe"
import GetNFTsParamsSearch from "./types/assetClient/getNFTsParamsSearch"
import GetNFTsResponse from "./types/assetClient/getNFTsResponse"

export default class AssetClient extends GlobalFetch {
  private _apiKey: Maybe<string> = null
  private _BACKEND_URL: string = "https://api.nfttrader.io"

  constructor(config: ApiKeyAuthorized) {
    super()
    this._apiKey = config.apiKey
  }

  /**
   * Get the collections info stored on the NFT Trader platform
   *
   * @param params - The search params to setup for querying the system.
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
   * Get the NFTs owned by a user
   *
   * @param params - The search params to setup for querying the system.
   */
  async getNFTs(params: GetNFTsParamsSearch): Promise<Maybe<GetNFTsResponse>> {
    const url: string = `${this._BACKEND_URL}/metadata/getNFTsByOwner/${
      params.networkId
    }/${params.address}/${params.take}${
      params.continuation ? `/${params.continuation}` : undefined
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
   * Store the collections set inside the system. If some collections are already stored they will be ignored.
   *
   * @param collections - The collections set to store inside the system
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
   * Check if collection is supported by the platform given its address and network id
   *
   * @param address - The address of the collection to check
   * @param networkId - The network id of the collection to check
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
   * Check if a set of collections is supported by the platform
   *
   * @param collections - The collections set to check
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
   * Override the basic configurations of this client
   *
   * @param config
   */
  public config(config: AssetClientConfig) {
    if (config.backendURL) this._BACKEND_URL = config.backendURL
  }

  /**
   *
   * @param collections
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
}
