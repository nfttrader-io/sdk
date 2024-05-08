import { ClientOptions, SubscriptionClient } from "subscriptions-transport-ws"
import { v4 as uuid4 } from "uuid"
import { RealTimeWebSocketConnectionParams } from "../../types/chat/realtimewebsocketconnectionparams"

// @ts-ignore
export default class UUIDSubscriptionClient extends SubscriptionClient {
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

  generateOperationId() {
    return uuid4()
  }

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

  buildMessage(id: string, type: string, payload: any) {
    if (type === "connection_init") payload = undefined
    // @ts-ignore
    return super.buildMessage(id, type, payload)
  }
}
