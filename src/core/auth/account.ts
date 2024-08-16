import { AccountSchema } from "@src/interfaces/auth"
import { Maybe } from "../../types"
import { AccountInitConfig } from "../../types/auth/account"
import { ConnectedWallet } from "@privy-io/react-auth"

export class Account implements AccountSchema {
  readonly did: string
  readonly organizationId: string
  readonly walletAddress: string
  readonly walletConnectorType: string
  readonly walletImported: boolean
  readonly walletRecoveryMethod: string
  readonly walletClientType: string
  readonly appleSubject: Maybe<string>
  readonly appleEmail: Maybe<string>
  readonly discordSubject: Maybe<string>
  readonly discordEmail: Maybe<string>
  readonly discordUsername: Maybe<string>
  readonly farcasterFid: Maybe<number>
  readonly farcasterDisplayName: Maybe<string>
  readonly farcasterOwnerAddress: Maybe<string>
  readonly farcasterPfp: Maybe<string>
  readonly farcasterSignerPublicKey: Maybe<string>
  readonly farcasterUrl: Maybe<string>
  readonly farcasterUsername: Maybe<string>
  readonly githubSubject: Maybe<string>
  readonly githubEmail: Maybe<string>
  readonly githubName: Maybe<string>
  readonly githubUsername: Maybe<string>
  readonly googleEmail: Maybe<string>
  readonly googleName: Maybe<string>
  readonly googleSubject: Maybe<string>
  readonly instagramSubject: Maybe<string>
  readonly instagramUsername: Maybe<string>
  readonly linkedinEmail: Maybe<string>
  readonly linkedinName: Maybe<string>
  readonly linkedinSubject: Maybe<string>
  readonly linkedinVanityName: Maybe<string>
  readonly spotifyEmail: Maybe<string>
  readonly spotifyName: Maybe<string>
  readonly spotifySubject: Maybe<string>
  readonly telegramFirstName: Maybe<string>
  readonly telegramLastName: Maybe<string>
  readonly telegramPhotoUrl: Maybe<string>
  readonly telegramUserId: Maybe<string>
  readonly telegramUsername: Maybe<string>
  readonly tiktokName: Maybe<string>
  readonly tiktokSubject: Maybe<string>
  readonly tiktokUsername: Maybe<string>
  readonly twitterName: Maybe<string>
  readonly twitterSubject: Maybe<string>
  readonly twitterProfilePictureUrl: Maybe<string>
  readonly twitterUsername: Maybe<string>
  readonly dynamoDBUserID: string
  readonly username: string
  readonly email: string
  readonly bio: string
  readonly firstLogin: boolean
  readonly avatarUrl: string
  readonly phone: Maybe<string>
  readonly isVerified: boolean
  readonly isNft: boolean
  readonly collectionAddress: string
  readonly tokenId: Maybe<string>
  readonly postNotificationPush: boolean
  readonly postNotificationSystem: boolean
  readonly dealNotificationPush: boolean
  readonly dealNotificationSystem: boolean
  readonly followNotificationPush: boolean
  readonly followNotificationSystem: boolean
  readonly collectionNotificationPush: boolean
  readonly collectionNotificationSystem: boolean
  readonly generalNotificationPush: boolean
  readonly generalNotificationSystem: boolean
  readonly accountSuspended: boolean
  readonly e2ePublicKey: string
  readonly e2eSecret: string
  readonly e2eSecretIV: string
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>
  readonly deletedAt: Maybe<Date>
  readonly token: string
  readonly allowNotification: boolean
  readonly allowNotificationSound: boolean
  readonly visibility: boolean
  readonly onlineStatus: "OFFLINE" | "ONLINE" | "BUSY"
  readonly allowReadReceipt: boolean
  readonly allowReceiveMessageFrom: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  readonly allowAddToGroupsFrom: "ONLY_FOLLOWED" | "EVERYONE"
  readonly allowGroupsSuggestion: boolean

  private connectedWallets: Array<ConnectedWallet> = []

  constructor(config: AccountInitConfig) {
    this.did = config.did
    this.organizationId = config.organizationId
    this.token = config.token
    this.walletAddress = config.walletAddress
    this.walletConnectorType = config.walletConnectorType
    this.walletImported = config.walletImported
    this.walletRecoveryMethod = config.walletRecoveryMethod
    this.walletClientType = config.walletClientType
    this.appleSubject = config.appleSubject
    this.appleEmail = config.appleEmail
    this.discordSubject = config.discordSubject
    this.discordEmail = config.discordEmail
    this.discordUsername = config.discordUsername
    this.farcasterFid = config.farcasterFid
    this.farcasterDisplayName = config.farcasterDisplayName
    this.farcasterOwnerAddress = config.farcasterOwnerAddress
    this.farcasterPfp = config.farcasterPfp
    this.farcasterSignerPublicKey = config.farcasterSignerPublicKey
    this.farcasterUrl = config.farcasterUrl
    this.farcasterUsername = config.farcasterUsername
    this.githubSubject = config.githubSubject
    this.githubEmail = config.githubEmail
    this.githubName = config.githubName
    this.githubUsername = config.githubUsername
    this.googleEmail = config.googleEmail
    this.googleName = config.googleName
    this.googleSubject = config.googleSubject
    this.instagramSubject = config.instagramSubject
    this.instagramUsername = config.instagramUsername
    this.linkedinEmail = config.linkedinEmail
    this.linkedinName = config.linkedinName
    this.linkedinSubject = config.linkedinSubject
    this.linkedinVanityName = config.linkedinVanityName
    this.spotifyEmail = config.spotifyEmail
    this.spotifyName = config.spotifyName
    this.spotifySubject = config.spotifySubject
    this.telegramFirstName = config.telegramFirstName
    this.telegramLastName = config.telegramLastName
    this.telegramPhotoUrl = config.telegramPhotoUrl
    this.telegramUserId = config.telegramUserId
    this.telegramUsername = config.telegramUsername
    this.tiktokName = config.tiktokName
    this.tiktokSubject = config.tiktokSubject
    this.tiktokUsername = config.tiktokUsername
    this.twitterName = config.twitterName
    this.twitterSubject = config.twitterSubject
    this.twitterProfilePictureUrl = config.twitterProfilePictureUrl
    this.twitterUsername = config.twitterUsername
    this.dynamoDBUserID = config.dynamoDBUserID
    this.username = config.username
    this.email = config.email
    this.bio = config.bio
    this.firstLogin = config.firstLogin
    this.avatarUrl = config.avatarUrl
    this.phone = config.phone
    this.isVerified = config.isVerified
    this.isNft = config.isNft
    this.collectionAddress = config.collectionAddress
    this.tokenId = config.tokenId
    this.postNotificationPush = config.postNotificationPush
    this.postNotificationSystem = config.postNotificationSystem
    this.dealNotificationPush = config.dealNotificationPush
    this.dealNotificationSystem = config.dealNotificationSystem
    this.followNotificationPush = config.followNotificationPush
    this.followNotificationSystem = config.followNotificationSystem
    this.collectionNotificationPush = config.collectionNotificationPush
    this.collectionNotificationSystem = config.collectionNotificationSystem
    this.generalNotificationPush = config.generalNotificationPush
    this.generalNotificationSystem = config.generalNotificationSystem
    this.accountSuspended = config.accountSuspended
    this.e2ePublicKey = config.e2ePublicKey
    this.e2eSecret = config.e2eSecret
    this.e2eSecretIV = config.e2eSecretIV
    this.createdAt = new Date(config.createdAt)
    this.updatedAt = config.updatedAt ? new Date(config.updatedAt) : null
    this.deletedAt = config.deletedAt ? new Date(config.deletedAt) : null
    this.allowNotification = config.allowNotification
    this.allowNotificationSound = config.allowNotificationSound
    this.visibility = config.visibility
    this.onlineStatus = config.onlineStatus
    this.allowReadReceipt = config.allowReadReceipt
    this.allowReceiveMessageFrom = config.allowReceiveMessageFrom
    this.allowAddToGroupsFrom = config.allowAddToGroupsFrom
    this.allowGroupsSuggestion = config.allowGroupsSuggestion
  }

  wallets(): Array<ConnectedWallet> {
    return this.connectedWallets
  }

  setWallets(wallets: Array<ConnectedWallet>): void {
    this.connectedWallets = wallets
  }
}
