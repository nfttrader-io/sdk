import Maybe from "../general/maybe"

export type User = {
  nonce: string
  jwt: string
  username: Maybe<string>
  email: Maybe<string>
  bio: Maybe<string>
  firstLogin: Maybe<0 | 1>
  avatarUrl: Maybe<string>
  isVerified: Maybe<0 | 1>
  isNft: Maybe<0 | 1>
  tokenId: Maybe<string>
  collectionAddress: Maybe<string>
  createdAt: Maybe<string>
  updatedAt: Maybe<string>
}
