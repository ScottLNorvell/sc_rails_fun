ScRailsFun::Application.routes.draw do
  root to: 'welcome#index'

  get '/show' => 'welcome#show'
  
end
