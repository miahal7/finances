Finances::Application.routes.draw do
  get 'categories/named_like', to: 'categories#named_like'
  get 'categories/names', to: 'categories#names'
  resources :categories

  get 'vendors/named_like', to: 'vendors#named_like'
  get 'vendors/names', to: 'vendors#names'
  resources :vendors

  resources :transactions

  resources :users

  get 'index', to: 'transactions#index'

  root :to => 'transactions#index'
end
