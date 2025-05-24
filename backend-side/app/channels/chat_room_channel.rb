class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room_#{params[:room_id]}"
  end

  def unsubscribed
    stop_all_streams
  end

  def speak(data)
    message = Message.create!(
      chat_room_id: params[:room_id],
      content: data['content']
    )
    
    # The broadcast is now handled by the Message model's after_create_commit callback
  end
end