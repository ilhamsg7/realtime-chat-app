module Api
  class ChatRoomsController < ApplicationController
    include ActionController::Cookies
    protect_from_forgery with: :null_session
    # GET /chat-rooms
    def index
      @rooms = ChatRoom.order(:created_at)
      render json: {
        values: @rooms,
        message: "Success!"
      }, status: 200
    end

    # GET /chat-rooms/:id
    def show
      room = ChatRoom.find(params[:id])
      render json: room, include: { messages: { only: [:id, :content, :created_at] } }
    end

    # POST /chat-rooms
    def create
      room = ChatRoom.new(room_params)
        if room.save
          render json: room, status: :created
        else
          render json: { errors: room.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def room_params
      params.require(:chat_room).permit(:name)
    end
  end
end
