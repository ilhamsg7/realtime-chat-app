module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      # For development, accept all connections
      self.current_user = SecureRandom.uuid
    end
  end
end