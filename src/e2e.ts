import { E2E as IE2E } from "./interfaces/e2e"
import Maybe from "./types/general/maybe"
import forge = require("node-forge")

export default class E2E implements IE2E {
  private _publicKey: Maybe<forge.pki.rsa.PublicKey>
  private _privateKey: Maybe<forge.pki.rsa.PrivateKey>
  private _keyPairGenerated: boolean

  constructor()
  constructor(publicKeyPem: string, privateKeyPem: string)
  constructor(publicKeyPem?: string, privateKeyPem?: string) {
    this._keyPairGenerated = false
    this._publicKey = null
    this._privateKey = null

    if (publicKeyPem && privateKeyPem) {
      try {
        this._publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
        this._privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
        this._keyPairGenerated = this._verifyKeys()
      } catch (err) {
        throw new Error(
          "E2E: an exception occured when i tried to convert the public key and the private key pem strings. Please provide a valid pair of strings."
        )
      }
    }
  }

  private _verifyKeys(): boolean {
    const testMessage = "Test message"
    const encrypted: string = this.encrypt(testMessage)
    const decrypted: string = this.decrypt(encrypted)

    if (decrypted !== testMessage) return false

    return true
  }

  encrypt(message: string): string {
    if (!this._publicKey)
      throw new Error(
        "E2E: an exception occured during the encryption of the message. The public key is not defined properly."
      )
    const encrypted = this._publicKey.encrypt(
      forge.util.encodeUtf8(message),
      "RSA-OAEP"
    )
    return forge.util.encode64(encrypted)
  }

  decrypt(encrypted: string): string {
    if (!this._privateKey)
      throw new Error(
        "E2E: an exception occured during the decryption of the message. The private key is not defined properly."
      )
    const decodedEncrypted = forge.util.decode64(encrypted)
    const decrypted = this._privateKey.decrypt(decodedEncrypted, "RSA-OAEP")
    return forge.util.decodeUtf8(decrypted)
  }

  keyPairGenerated(): boolean {
    return this._keyPairGenerated
  }

  async generateKeys(): Promise<forge.pki.rsa.KeyPair> {
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair(
        { bits: 4096, workers: -1 },
        (err, keyPair: forge.pki.rsa.KeyPair) => {
          if (err) {
            this._keyPairGenerated = false
            console.error(err)
            reject(
              "E2E: An exception occured during the generation of the key pairs. See the console to have more info about the error."
            )
          } else {
            this._keyPairGenerated = true
            resolve(keyPair)
          }
        }
      )
    })
  }
}
