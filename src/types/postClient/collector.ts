export default interface Collector {
  username: string
  address: string
  imageUrl: string
  isVerified: 0 | 1
  isNft: 0 | 1
  networkId?: string
  isFavourite?: 0 | 1
  isRegistered?: 0 | 1
}
