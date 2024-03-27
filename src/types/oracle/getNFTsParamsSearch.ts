import Network from "../general/network"

type GetNFTsParamsSearch = {
  networkId: Network
  address: string
  take: number
  collections?: Array<{ address: string }>
  continuation?: string
}

export default GetNFTsParamsSearch
