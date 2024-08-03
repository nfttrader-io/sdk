import { DexieStorage, RealmStorage } from "@src/core/app"

/**
 * Represents the configuration needed to initialize the engine.
 * @type EngineInitConfig
 */
export type EngineInitConfig = {
  /**
   * @property {string} apiKey - The API key for accessing services.
   */
  apiKey: string

  storage: DexieStorage | RealmStorage
}
