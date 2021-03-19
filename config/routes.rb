# frozen_string_literal: true

Rails.application.routes.draw do
  post '/graphql', to: 'graphql#execute'

  get 'login', to: 'sessions#new', as: :login
  match '/auth/mixin/callback', to: 'sessions#create', via: %i[get post]
  get 'logout', to: 'sessions#delete', as: :logout

  root to: 'home#index'

  namespace :admin do
    get 'logout', to: 'sessions#delete', as: :logout

    # sidekiq
    # mount Sidekiq::Web, at: 'sidekiq', constraints: AdminConstraint.new

    root to: 'home#index'
    get '*path' => 'home#index'
  end
end
