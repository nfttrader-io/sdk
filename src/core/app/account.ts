import { AccountSchema } from "../../interfaces/app/schema"
import { Maybe } from "../../types"
import { AccountInitConfig } from "../../types/app"

export class Account implements AccountSchema {
  readonly nonce: string
  readonly jwt: string
  readonly username: Maybe<string>
  readonly email: Maybe<string>
  readonly bio: Maybe<string>
  readonly firstLogin: Maybe<boolean>
  readonly avatarUrl: Maybe<string>
  readonly isVerified: Maybe<boolean>
  readonly isNft: Maybe<boolean>
  readonly tokenId: Maybe<string>
  readonly collectionAddress: Maybe<string>
  readonly createdAt: Maybe<string>
  readonly updatedAt: Maybe<string>

  constructor(config: AccountInitConfig) {
    this.nonce = config.nonce
    this.jwt = config.jwt
    this.username = config.username
    this.email = config.email
    this.bio = config.bio
    this.firstLogin = config.firstLogin
    this.avatarUrl = config.avatarUrl
    this.isVerified = config.isVerified
    this.isNft = config.isNft
    this.tokenId = config.tokenId
    this.collectionAddress = config.collectionAddress
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
  }
}
