Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  defaults format: :json do
    namespace :api do
      namespace :v1 do
        resource :users, only: [:show, :create, :update, :destroy]
        resources :users_name, only: [:index]
        resource :likes, only: [:create]
        resources :likes, only: [:index, :show, :destroy]
        resource :profiles, only: [:update]
        resources :profiles, only: [:show]
        resources :books, only: [:index, :show]
        resources :user_analytics, only: [:index, :create]
        resources :google_oauth2, only: [:create] do
          post :authorization_url, on: :collection
        end
        resources :auth_token, only: [:create] do
          post :refresh, on: :collection
          delete :destroy, on: :collection
        end
      end
    end
  end
end
