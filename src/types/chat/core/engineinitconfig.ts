import forge = require("node-forge")
import { Maybe } from "../../../types/base"
import { KeyPairItem } from "../../../types/chat/keypairitem"

/**
 * Represents the configuration needed to initialize the engine.
 * @type EngineInitConfig
 */
export type EngineInitConfig = {
  /**
   * @property {string} jwtToken - The JWT token for authentication.
   */
  jwtToken: string
  /**
   * @property {string} apiKey - The API key for accessing services.
   */
  apiKey: string
  /**
   * @property {string} apiUrl - The URL of the API.
   */
  apiUrl: string
  /**
   * @property {string} realtimeApiUrl - The URL of the real-time API.
   */
  realtimeApiUrl: string
  /**
   * @property {Maybe<forge.pki.rsa.KeyPair>} userKeyPair - The user's RSA key pair, if available.
   */
  userKeyPair: Maybe<forge.pki.rsa.KeyPair>
  /**
   * @property {Maybe<Array<KeyPairItem>>} keyPairsMap - An array of key pair items, if available.
   */
  keyPairsMap: Maybe<Array<KeyPairItem>>
}
