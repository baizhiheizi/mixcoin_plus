# frozen_string_literal: true

Rails.application.routes.draw do
  post '/graphql', to: 'graphql#execute'
  root to: 'home#index'

  namespace :admin do
    get 'logout', to: 'sessions#delete', as: :logout

    # sidekiq
    # mount Sidekiq::Web, at: 'sidekiq', constraints: AdminConstraint.new

    root to: 'home#index'
    get '*path' => 'home#index'
  end
end
