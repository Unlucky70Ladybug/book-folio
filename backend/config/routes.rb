Rails.application.routes.draw do
  # ログイン機能のルーティング
  mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: "auth/registrations",
    confirmations: "auth/confirmations"
  }
  # ログインユーザー取得のルーティング
  namespace :auth do
    resources :sessions, only: %i[index]
  end

  namespace :api do
    namespace :v1 do
      get "/search", to: "search_books#search"

      resources :bookshelves, only: [ :index, :create, :update ]
      resources :genres, only: [ :index ]
      resources :preferences, only: [ :index, :update ] do
        collection do
          get :undiagnosed
        end
      end
      resources :genre_statistics, only: [ :index ]
      resources :author_statistics, only: [ :index ]
      resources :user_comparisons, only: [ :index ]
      resources :books, param: :isbn, only: [] do
        resources :posts, only: [ :index ], module: :books # Books 名前空間のコントローラを使う
      end
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end
end
