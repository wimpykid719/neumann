Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api, format: "json" do
    namespace :v1 do
      resources :users, only: [:index, :create]
    end
  end
end
