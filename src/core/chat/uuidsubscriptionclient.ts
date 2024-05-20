import { ClientOptions, SubscriptionClient } from "subscriptions-transport-ws"
import { v4 as uuid4 } from "uuid"
import { RealTimeWebSocketConnectionParams } from "../../types/chat/realtimewebsocketconnectionparams"

/**
 * Represents a custom SubscriptionClient that extends the functionality of the SubscriptionClient class.
 * @class UUIDSubscriptionClient
 * @extends SubscriptionClient
 */
// @ts-ignore
export default class UUIDSubscriptionClient extends SubscriptionClient {
  /**
   * Constructs a new UUIDSubscriptionClient instance with the provided URL, client options, and connection parameters.
   * @param {string} url - The URL for the WebSocket connection.
   * @param {ClientOptions} args - The options for the WebSocket client.
   * @param {RealTimeWebSocketConnectionParams} connectionParams - The connection parameters for the WebSocket connection.
   * @returns None
   */
  constructor(
    url: string,
    args: ClientOptions,
    connectionParams: RealTimeWebSocketConnectionParams
  ) {
    super(
      `${url}?header=${btoa(JSON.stringify(connectionParams))}&payload=${btoa(
        JSON.stringify({})
      )}`,
      args
    )
  }

  /**
   * Generates a unique operation ID using the uuid4 function.
   * @returns A unique operation ID.
   */
  generateOperationId() {
    return uuid4()
  }

  /**
   * Process the received data, parsing it as JSON and checking for a specific message type.
   * If the message type is "start_ack", the function returns early.
   * If the received data is not JSON-parsable, an error is thrown.
   * @param {string} receivedData - The data received as a string.
   * @returns None
   */
  processReceivedData(receivedData: string) {
    try {
      const parsedMessage = JSON.parse(receivedData)
      if (parsedMessage?.type === "start_ack") return
    } catch (e) {
      throw new Error("Message must be JSON-parsable. Got: " + receivedData)
    }

    // @ts-ignore
    super.processReceivedData(receivedData)
  }

  /**
   * Builds a message with the given id, type, and payload.
   * If the type is "connection_init", the payload is set to undefined.
   * @param {string} id - The id of the message.
   * @param {string} type - The type of the message.
   * @param {any} payload - The payload of the message.
   * @returns The built message.
   */
  buildMessage(id: string, type: string, payload: any) {
    if (type === "connection_init") payload = undefined
    // @ts-ignore
    return super.buildMessage(id, type, payload)
  }
}
