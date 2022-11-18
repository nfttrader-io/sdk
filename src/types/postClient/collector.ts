export default interface Collector {
  networkId: string
  username: string
  address: string
  imageUrl: string
  isVerified: 0 | 1
  isNft: 0 | 1
  isFavourite?: 0 | 1
  isRegistered?: 0 | 1
}
