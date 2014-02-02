Finances::Application.routes.draw do
  get 'category_name/like', to: 'categories#named_like'
  get 'transactions/:id/category_name/named_like', to: 'categories#named_like'

  resources :categories

  get 'vendor_name/like', to: 'vendors#named_like'
  resources :vendors

  resources :transactions

  resources :users

  get 'index', to: 'transactions#index'

  root :to => 'transactions#index'
  #root :to => 'application#index'
end
