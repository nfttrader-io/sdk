import { BaseStorage } from "./basestorage"
import Realm, { Results } from "realm"
import { Maybe } from "../../types"
import { LocalDBConversation, LocalDBMessage, LocalDBUser } from "./database"
import { RealmObject } from "realm/dist/public-types/Object"
import { DefaultObject } from "realm/dist/public-types/schema"
import { CLIENT_DB_NAME } from "@src/constants/app"

class Conversation extends Realm.Object implements LocalDBConversation {
  compositeKey!: string
  id!: string
  userDid!: string
  organizationId!: string
  name!: string
  description!: string
  imageURL!: string
  bannerImageURL!: string
  settings!: string
  isArchived!: boolean
  lastMessageSentAt!: Maybe<Date>
  lastMessageRead!: Maybe<Date>
  createdAt!: Date
  updatedAt!: Maybe<Date>
  deletedAt!: Maybe<Date>

  static schema = {
    name: "Conversation",
    properties: {
      compositeKey: "string",
      id: "string",
      userDid: "string",
      organizationId: "string",
      name: "string",
      description: "string",
      imageURL: "string",
      bannerImageURL: "string",
      settings: "string",
      isArchived: "bool",
      lastMessageSentAt: "date?",
      lastMessageRead: "date?",
      createdAt: "date",
      updatedAt: "date?",
      deletedAt: "date?",
    },
    primaryKey: "compositeKey",
  }
}

class Message extends Realm.Object implements LocalDBMessage {
  compositeKey!: string
  id!: string
  userDid!: string
  userId!: string
  organizationId!: string
  conversationId!: string
  content!: string
  reactions!: { content: string; userId: string; createdAt: Date }[]
  isImportant!: boolean
  type!:
    | "TEXTUAL"
    | "ATTACHMENT"
    | "NFT"
    | "SWAP_PROPOSAL"
    | "RENT"
    | "EJECTED"
    | "LEFT"
  origin!: "SYSTEM" | "USER"
  messageRoot!: Maybe<LocalDBMessage>
  messageRootId!: Maybe<string>
  createdAt!: Date
  updatedAt!: Maybe<Date>
  deletedAt!: Maybe<Date>

  static schema = {
    name: "Message",
    properties: {
      compositeKey: "string",
      id: "string",
      userDid: "string",
      userId: "string",
      organizationId: "string",
      conversationId: "string",
      content: "string",
      reactions: "mixed[]",
      isImportant: "bool",
      type: "string",
      origin: "string",
      messageRoot: "mixed?",
      messageRootId: "string?",
      createdAt: "date",
      updatedAt: "date?",
      deletedAt: "date?",
    },
    primaryKey: "compositeKey",
  }
}

class User extends Realm.Object implements LocalDBUser {
  compositeKey!: string
  did!: string
  organizationId!: string
  username!: string
  email!: string
  bio!: string
  avatarUrl!: string
  isVerified!: boolean
  isNft!: boolean
  wallet!: { address: string; connectorType: string }
  apple!: Maybe<{ subject: Maybe<string>; email: Maybe<string> }>
  discord!: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    username: Maybe<string>
  }>
  farcaster!: Maybe<{
    fid: Maybe<number>
    displayName: Maybe<string>
    ownerAddress: Maybe<string>
    pfp: Maybe<string>
    username: Maybe<string>
  }>
  github!: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
    username: Maybe<string>
  }>
  google!: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
  }>
  instagram!: Maybe<{ subject: Maybe<string>; username: Maybe<string> }>
  linkedin!: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
    vanityName: Maybe<string>
  }>
  spotify!: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
  }>
  telegram!: Maybe<{
    firstName: Maybe<string>
    lastName: Maybe<string>
    photoUrl: Maybe<string>
    userId: Maybe<string>
    username: Maybe<string>
  }>
  tiktok!: Maybe<{
    name: Maybe<string>
    subject: Maybe<string>
    username: Maybe<string>
  }>
  twitter!: Maybe<{
    name: Maybe<string>
    subject: Maybe<string>
    profilePictureUrl: Maybe<string>
    username: Maybe<string>
  }>
  allowNotification!: boolean
  allowNotificationSound!: boolean
  visibility!: boolean
  onlineStatus!: "ONLINE" | "OFFLINE" | "BUSY"
  allowReadReceipt!: boolean
  allowReceiveMessageFrom!: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  allowAddToGroupsFrom!: "ONLY_FOLLOWED" | "EVERYONE"
  allowGroupsSuggestion!: boolean
  e2ePublicKey!: string
  e2eEncryptedPrivateKey!: string
  createdAt!: Date
  updatedAt!: Maybe<Date>

  static schema = {
    name: "User",
    properties: {
      compositeKey: "string",
      did: "string",
      organizationId: "string",
      username: "string",
      email: "string",
      bio: "string",
      avatarUrl: "string",
      isVerified: "bool",
      isNft: "bool",
      wallet: "mixed",
      apple: "mixed",
      discord: "mixed",
      farcaster: "mixed",
      github: "mixed",
      google: "mixed",
      instagram: "mixed",
      linkedin: "mixed",
      spotify: "mixed",
      telegram: "mixed",
      tiktok: "mixed",
      twitter: "mixed",
      allowNotification: "bool",
      allowNotificationSound: "bool",
      visibility: "bool",
      onlineStatus: "string",
      allowReadReceipt: "bool",
      allowReceiveMessageFrom: "string",
      allowAddToGroupsFrom: "string",
      allowGroupsSuggestion: "bool",
      e2ePublicKey: "string",
      e2eEncryptedPrivateKey: "string",
      createdAt: "date",
      updatedAt: "date?",
    },
    primaryKey: "compositeKey",
  }
}

export class RealmStorage implements BaseStorage {
  private realm: Maybe<Realm>
  private _enableStorage = true

  private constructor() {
    this.realm = new Realm({
      path: `${CLIENT_DB_NAME}.realm`,
      schema: [Conversation, Message, User],
    })
  }

  static async createOrConnect(): Promise<RealmStorage> {
    return new RealmStorage()
  }

  async get(
    tableName: "user" | "conversation" | "message",
    key: string,
    value: string | string[]
  ): Promise<any> {
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    return new Promise(async (resolve, reject) => {
      try {
        if (!this._enableStorage) return

        if (tableName === "user") {
          resolve(
            this.realm!.objects("User").filtered(`${key} == '${value}'`)[0]
          )
        } else if (tableName === "conversation") {
          resolve(
            this.realm!.objects("Conversation").filtered(
              `${key} == '${value}'`
            )[0]
          )
        } else if (tableName === "message") {
          resolve(
            this.realm!.objects("Message").filtered(`${key} == '${value}'`)[0]
          )
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async deleteItem(
    tableName: "user" | "conversation" | "message",
    key: string,
    value: string | string[]
  ): Promise<void> {
    if (!this._enableStorage) return
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    return new Promise(async (resolve, reject) => {
      try {
        this.realm!.write(() => {
          let record

          if (tableName === "user")
            record = this.realm!.objectForPrimaryKey("User", value)
          else if (tableName === "conversation")
            record = this.realm!.objectForPrimaryKey("Conversation", value)
          else if (tableName === "message")
            record = this.realm!.objectForPrimaryKey("Message", value)

          if (record) this.realm!.delete(record)

          resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async deleteBulk(
    tableName: "user" | "conversation" | "message",
    ids: string[]
  ): Promise<void> {
    if (!this._enableStorage) return
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    return new Promise(async (resolve, reject) => {
      try {
        this.realm!.write(() => {
          let records
          const keysQuery = ids.map((key) => `"${key}"`).join(",")

          if (tableName === "user")
            records = this.realm!.objects("User").filtered(
              `compositeKey IN ${keysQuery}`
            )
          else if (tableName === "conversation")
            records = this.realm!.objects("Conversation").filtered(
              `compositeKey IN ${keysQuery}`
            )
          else if (tableName === "message")
            records = this.realm!.objects("Message").filtered(
              `compositeKey IN ${keysQuery}`
            )

          if (records) this.realm!.delete(records)
        })

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  async query(
    callback: (
      db: Realm,
      table: Results<RealmObject<DefaultObject, never> & DefaultObject>
    ) => void,
    tableName: "user" | "conversation" | "message"
  ): Promise<void> {
    if (!this._enableStorage) return
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    if (tableName === "user") callback(this.realm, this.realm.objects("User"))
    else if (tableName === "conversation")
      callback(this.realm, this.realm.objects("Conversation"))
    else if (tableName === "message")
      callback(this.realm, this.realm.objects("Message"))
  }

  async insertBulkSafe<T>(tableName: string, items: T[]): Promise<void> {
    if (!this._enableStorage) return
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    return new Promise(async (resolve, reject) => {
      try {
        this.realm!.write(() => {
          if (tableName === "user") {
            items.forEach((item) => {
              this.realm!.create(
                "User",
                {
                  ...(item as User),
                  compositeKey: `${(item as User).did}-${
                    (item as User).organizationId
                  }`,
                },
                Realm.UpdateMode.All
              )
            })
          } else if (tableName === "conversation") {
            items.forEach((item) => {
              this.realm!.create(
                "Conversation",
                {
                  ...(item as Conversation),
                  compositeKey: `${(item as Conversation).id}-${
                    (item as Conversation).userDid
                  }`,
                },
                Realm.UpdateMode.All
              )
            })
          } else if (tableName === "message") {
            items.forEach((item) => {
              this.realm!.create(
                "Message",
                {
                  ...(item as Message),
                  compositeKey: `${(item as Message).id}-${
                    (item as Message).userDid
                  }`,
                },
                Realm.UpdateMode.All
              )
            })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  disableStorage(): void {
    this._enableStorage = false
  }

  enableStorage(): void {
    this._enableStorage = true
  }

  getDBName(): string {
    throw new Error("Method not implemented.")
  }

  getDBVersion(): number {
    throw new Error("Method not implemented.")
  }

  typeOf(): string {
    return this.constructor.name
  }

  isStorageEnabled(): boolean {
    return this._enableStorage === true
  }

  getTable<T>(tableName: "user" | "conversation" | "message") {
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    if (tableName === "user") return this.realm!.objects("User") as T
    else if (tableName === "conversation")
      return this.realm!.objects("Conversation") as T
    else if (tableName === "message") return this.realm!.objects("Message") as T

    throw new Error(`Table ${tableName} not found`)
  }

  truncate(tableName: "user" | "conversation" | "message"): Promise<void> {
    if (!this._enableStorage)
      return new Promise((resolve, reject) => {
        resolve()
      })
    if (!this.realm)
      throw new Error(
        "A Realm object must be initialized in order to use this method."
      )

    return new Promise((resolve, reject) => {
      try {
        this.realm!.write(() => {
          let records

          if (tableName === "user") records = this.realm!.objects("User")
          else if (tableName === "conversation")
            records = this.realm!.objects("Conversation")
          else if (tableName === "message")
            records = this.realm!.objects("Message")

          if (records) this.realm!.delete(records)

          resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
