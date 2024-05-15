import forge = require("node-forge")
import Maybe from "../../types/general/maybe"

/**
 * A class that provides cryptographic functions using the node-forge library.
 * @class Crypto
 */
export class Crypto {
  /**
   * Verifies that the given public and private keys can correctly encrypt and decrypt a test message.
   * @param {forge.pki.rsa.PublicKey} publicKey - The public key used for encryption.
   * @param {forge.pki.rsa.PrivateKey} privateKey - The private key used for decryption.
   * @returns {boolean} True if the keys can successfully encrypt and decrypt a test message, false otherwise.
   */
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

  /**
   * Encrypts a message using the provided RSA public key.
   * @param {forge.pki.rsa.PublicKey} publicKey - The RSA public key used for encryption.
   * @param {string} message - The message to be encrypted.
   * @returns {string} The encrypted message encoded in base64 format.
   */
  static encrypt(publicKey: forge.pki.rsa.PublicKey, message: string): string {
    const encrypted = publicKey.encrypt(
      forge.util.encodeUtf8(message),
      "RSA-OAEP"
    )
    return forge.util.encode64(encrypted)
  }

  /**
   * Decrypts an encrypted string using the provided private key.
   * @param {forge.pki.rsa.PrivateKey} privateKey - The private key used for decryption.
   * @param {string} encrypted - The encrypted string to decrypt.
   * @returns {string} The decrypted string.
   */
  static decrypt(
    privateKey: forge.pki.rsa.PrivateKey,
    encrypted: string
  ): string {
    const decodedEncrypted = forge.util.decode64(encrypted)
    const decrypted = privateKey.decrypt(decodedEncrypted, "RSA-OAEP")
    return forge.util.decodeUtf8(decrypted)
  }

  /**
   * Generates a new RSA key pair based on the specified security level.
   * @param {("STANDARD" | "HIGH")} security - The security level for key generation, either "STANDARD" or "HIGH".
   * @returns {Promise<forge.pki.rsa.KeyPair>} A promise that resolves with the generated RSA key pair.
   */
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

  /**
   * Generates a key pair from PEM formatted public and private keys.
   * @param {string} publicKeyPem - The PEM formatted public key.
   * @param {string} privateKeyPem - The PEM formatted private key.
   * @returns {Promise<Maybe<forge.pki.rsa.KeyPair>>} A promise that resolves to a key pair object
   * or null if the keys cannot be verified.
   */
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

  /**
   * Decrypts a string using the provided private key.
   * @param {Maybe<forge.pki.rsa.PrivateKey>} privateKey - The private key used for decryption.
   * @param {string} content - The content to decrypt.
   * @returns The decrypted string.
   * @throws Error if the private key is not set up correctly.
   */
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

  /**
   * Encrypts a string using the provided public key or throws an error if the public key is not provided.
   * @param {Maybe<forge.pki.rsa.PublicKey>} publicKey - The public key used for encryption.
   * @param {string} content - The content to be encrypted.
   * @returns The encrypted content.
   * @throws Error if the public key is not provided.
   */
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
