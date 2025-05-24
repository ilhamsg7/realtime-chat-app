import consumer from "channels/consumer"

export default function subscribeToRoom(roomId, receivedCallback) {
  return consumer.subscriptions.create(
    { channel: "ChatRoomChannel", room: roomId },
    {
      received(data) {
        receivedCallback(data)
      }
    }
  )
}
