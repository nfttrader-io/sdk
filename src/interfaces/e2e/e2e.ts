import forge = require("node-forge")

export interface E2E {
  generateKeys(): Promise<forge.pki.rsa.KeyPair>
  keyPairGenerated(): boolean
  encrypt(message: string): string
  decrypt(message: string): string
}
