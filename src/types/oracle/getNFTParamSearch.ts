import Network from "../general/network"

type GetNFTParamsSearch = {
  networkId: Network
  collectionAddress: string
  tokenId: string
  address?: string
}

export default GetNFTParamsSearch
