#========================
#CONFIG
#========================
set :application, "api.pomeo.me"
#========================
#CONFIG
#========================
require           "capistrano-offroad"
offroad_modules   "defaults", "supervisord"
set :repository,  "git@github.com:pomeo/#{application}.git"
set :supervisord_start_group, "app"
set :supervisord_stop_group,  "app"
#========================
#ROLES
#========================
set  :gateway,    "#{application}" # main server
role :app,        "10.3.90.1"      # container

namespace :deploy do
  desc "Change node.js port"
  task :chg_port do
    run "sed -i 's/3000/3700/g' #{current_path}/app.js"
  end
end

after "deploy:create_symlink", "deploy:npm_install", "deploy:chg_port", "deploy:restart"
