import forge = require("node-forge")

/**
 * Represents an item containing an ID and a RSA Key Pair generated using the node-forge library.
 */
export type KeyPairItem = {
  /**
   * @property {string} id - the id of the key.
   */
  id: string
  /**
   * @property {forge.pki.rsa.KeyPair} keypair - the key pair associated.
   */
  keypair: forge.pki.rsa.KeyPair
}
