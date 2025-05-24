require "test_helper"

class MessageTest < ActiveSupport::TestCase
  RSpec.describe Message, type: :model do
    it { should belong_to(:chat_room) }
    it { should validate_presence_of(:content) }
  end

  RSpec.describe "Messages API", type: :request do
    let!(:room) { ChatRoom.create!(name: 'general') }

    it "creates a message" do
      expect {
        post api_chat_room_messages_path(room),
            params: { message: { content: "Hola" } }.to_json,
            headers: { "CONTENT_TYPE" => "application/json" }
      }.to change(Message, :count).by(1)
      expect(response).to have_http_status(:ok)
    end
  end
end
