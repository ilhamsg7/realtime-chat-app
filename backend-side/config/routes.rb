Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  
  namespace :api do
    resources :chat_rooms, only: [:index, :show, :create] do
      resources :messages,    only: [:index, :create]
    end
  end

  # get "up" => "rails/health#show", as: :rails_health_check
end
