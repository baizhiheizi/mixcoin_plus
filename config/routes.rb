# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq/cron/web'

class AdminConstraint
  def matches?(request)
    return false if request.session[:current_admin_id].blank?

    admin = Administrator.find_by(id: request.session[:current_admin_id])
    admin.present?
  end
end

Rails.application.routes.draw do
  post '/graphql', to: 'graphql#execute'

  get 'login', to: 'sessions#new', as: :login
  match '/auth/mixin/callback', to: 'sessions#create', via: %i[get post]
  get 'logout', to: 'sessions#delete', as: :logout

  # health check for render.com
  get 'healthz', to: 'healthz#index', as: :healthz

  root to: 'home#index'

  namespace :ifttb do
    get :login, to: 'sessions#new', as: :login
    match 'auth/mixin/callback', to: 'sessions#create', via: %i[get post]
    get :logout, to: 'sessions#delete', as: :logout

    get :menu, to: 'home#menu'

    resources :applets do
      post :pend
      post :connect
      post :disconnect
      post :archive

      resources :applet_datetime_triggers, except: %i[index show]
      resources :applet_4swap_triggers, except: %i[index show]
      resources :applet_pando_leaf_triggers, except: %i[index show]
      resources :applet_pando_rings_triggers, except: %i[index show]
      resources :applet_exin_local_triggers, except: %i[index show]

      resources :applet_4swap_actions, except: %i[index show]
      resources :applet_mix_swap_actions, except: %i[index show]
      resources :applet_alert_actions, except: %i[index show]
    end

    resource :stats, only: :show
    resource :wallet, only: :show do
      post :withdraw
    end
    resources :orders, only: %i[new create]

    root to: 'applets#index'
  end

  namespace :admin do
    get 'logout', to: 'sessions#delete', as: :logout

    # sidekiq
    mount Sidekiq::Web, at: 'sidekiq', constraints: AdminConstraint.new

    # exception
    mount ExceptionTrack::Engine => '/exception-track'

    root to: 'home#index'
    get '*path' => 'home#index'
  end

  get '*path' => 'home#index'
end
