import GlobalFetch from "./lib/globalFetch"
import ApiKeyAuthorized from "./types/assetClient/apiKeyAuthorized"
import AssetClientConfig from "./types/assetClient/assetClientConfig"
import JWTAuthorized from "./types/assetClient/jwtAuthorized"
import HTTPRequestInit from "./types/general/httpRequestInit"
import HTTPResponse from "./types/general/httpResponse"
import Maybe from "./types/general/maybe"

export default class AssetClient extends GlobalFetch {
  private _apiKey: Maybe<string> = null
  private _jwt: Maybe<string> = null
  private _BACKEND_URL: string = "https://api.nfttrader.io"

  constructor(config: JWTAuthorized | ApiKeyAuthorized) {
    super()
    if (`jwt` in config) this._jwt = config.jwt
    else if (`apiKey` in config) this._apiKey = config.apiKey
  }

  /**
   *
   * @param collections
   */
  async addCollections(
    collections: Array<{ address: string; networkId: string }>
  ) {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { data } = await this._fetchWithAuth<string>(
        `${this._BACKEND_URL}/collections/insertCollectionBulk`,
        {
          method: "POST",
          body: {
            collections,
          },
        }
      )

      return data
    } catch (e) {
      throw e
    }
  }

  /**
   *
   * @param address
   */
  async isCollectionSupported(address: string, networkId: string) {
    this._validate([address])

    try {
      const { data } = await this._fetchWithAuth<string>(
        `${this._BACKEND_URL}/collections/isSupported/${address}/${networkId}`,
        {
          method: "GET",
        }
      )

      return data
    } catch (e) {
      throw e
    }
  }

  /**
   *
   * @param collections
   */
  async collectionsSupported(
    collections: Array<{ address: string; networkId: string }>
  ) {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { data } = await this._fetchWithAuth<string>(
        `${this._BACKEND_URL}/collections/isSupportedBulk`,
        {
          method: "POST",
          body: {
            collections,
          },
        }
      )

      return data
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
      authorization: `${this._jwt ? "Bearer" : "x-api-key"} ${
        this._jwt ?? this._apiKey
      }`,
    }

    if (this._jwt) options.headers["authorizer-type"] = "token"
    else if (this._apiKey) options.headers["authorizer-type"] = "request"

    return this._fetch(url, options)
  }
}
