import forge = require("node-forge")

export type KeyPairItem = {
  id: string
  keypair: forge.pki.rsa.KeyPair
}
