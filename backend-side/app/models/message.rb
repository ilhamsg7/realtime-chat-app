class Message < ApplicationRecord
  belongs_to :chat_room
  validates :content, presence: true

  after_create_commit -> {
    ActionCable.server.broadcast(
      "chat_room_#{chat_room_id}",
      {
        id: id,
        content: content,
        created_at: created_at.strftime("%H:%M")
      }
    )
  }
end