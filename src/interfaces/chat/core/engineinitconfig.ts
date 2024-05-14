import forge = require("node-forge")
import Maybe from "../../../types/general/maybe"
import { KeyPairItem } from "../../../types/chat/keypairitem"

export interface EngineInitConfig {
  jwtToken: string
  apiKey: string
  apiUrl: string
  realtimeApiUrl: string
  userKeyPair: Maybe<forge.pki.rsa.KeyPair>
  keyPairsMap: Maybe<Array<KeyPairItem>>
}
