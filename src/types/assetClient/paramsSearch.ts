type ParamsSearch = {
  userAddress: string
  searchType: "NFT" | "TKN" | "ALL"
  skip: number
  take: number
  networkId?: string
  queryString?: string
}

export default ParamsSearch