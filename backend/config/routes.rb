Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api, format: "json" do
    namespace :v1 do
      resource :users, only: [:show, :create, :update]
      resource :profiles, only: [:update]
      resources :profiles, only: [:show]
      resources :books, only: [:index, :show]

      resources :auth_token, only: [:create] do
        post :refresh, on: :collection
        delete :destroy, on: :collection
      end
    end
  end
end
