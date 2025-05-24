module Api
  class MessagesController < ApplicationController
    include ActionController::Cookies
    protect_from_forgery with: :null_session
    before_action :set_chat_room

    # GET /messages
    def index
      msgs = @chat_room.messages.order(:created_at)
      render json: msgs, only: [:id, :content, :created_at]
    end

    # POST /messages
    def create
      msg = @chat_room.messages.build(message_params) 
      if msg.save
        head :ok
      else
        render json: { errors: msg.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_chat_room
      @chat_room = ChatRoom.find(params[:chat_room_id])
    end

    def message_params
      params.require(:message).permit(:content)
    end
  end
end