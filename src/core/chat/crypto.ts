import forge = require("node-forge")
import Maybe from "../../types/general/maybe"

export class Crypto {
  static verifyKeys(
    publicKey: forge.pki.rsa.PublicKey,
    privateKey: forge.pki.rsa.PrivateKey
  ): boolean {
    const testMessage = "Test message"
    const encrypted: string = Crypto.encrypt(publicKey, testMessage)
    const decrypted: string = Crypto.decrypt(privateKey, encrypted)

    if (decrypted !== testMessage) return false

    return true
  }

  static encrypt(publicKey: forge.pki.rsa.PublicKey, message: string): string {
    const encrypted = publicKey.encrypt(
      forge.util.encodeUtf8(message),
      "RSA-OAEP"
    )
    return forge.util.encode64(encrypted)
  }

  static decrypt(
    privateKey: forge.pki.rsa.PrivateKey,
    encrypted: string
  ): string {
    const decodedEncrypted = forge.util.decode64(encrypted)
    const decrypted = privateKey.decrypt(decodedEncrypted, "RSA-OAEP")
    return forge.util.decodeUtf8(decrypted)
  }

  static async generateKeys(
    security: "STANDARD" | "HIGH"
  ): Promise<forge.pki.rsa.KeyPair> {
    return new Promise((resolve, reject) => {
      if (security !== "STANDARD" && security !== "HIGH")
        reject("please provide a valid security argument")

      forge.pki.rsa.generateKeyPair(
        { bits: security === "HIGH" ? 4096 : 2048, workers: -1 },
        (err, keyPair: forge.pki.rsa.KeyPair) => {
          if (err) {
            console.error(err)
            reject(
              "E2E: An exception occured during the generation of the key pairs. See the console to have more info about the error."
            )
          } else {
            resolve(keyPair)
          }
        }
      )
    })
  }

  static async generateKeyPairFromPem(
    publicKeyPem: string,
    privateKeyPem: string
  ): Promise<Maybe<forge.pki.rsa.KeyPair>> {
    return new Promise((resolve, reject) => {
      try {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
        const verify = Crypto.verifyKeys(publicKey, privateKey)

        if (!verify) resolve(null)

        resolve({ privateKey, publicKey } as forge.pki.rsa.KeyPair)
      } catch (err) {
        console.error(err)
        reject(
          "E2E: an exception occured when i tried to convert the public key and the private key pem strings. Please provide a valid pair of strings."
        )
      }
    })
  }

  static decryptStringOrFail(
    privateKey: Maybe<forge.pki.rsa.PrivateKey>,
    content: string
  ) {
    if (!privateKey)
      throw new Error(
        "An exception occured during the decryption of a message. The private key is not setup correctly."
      )

    return Crypto.decrypt(privateKey, content)
  }

  static encryptStringOrFail(
    publicKey: Maybe<forge.pki.rsa.PublicKey>,
    content: string
  ) {
    if (!publicKey)
      throw new Error(
        "An exception occured during the decryption of a message. The private key is not setup correctly."
      )

    return Crypto.encrypt(publicKey, content)
  }
}
