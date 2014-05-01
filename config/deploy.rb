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
set :supervisord_start_group, "api"
set :supervisord_stop_group,  "api"
#========================
#ROLES
#========================
role :app,        "ubuntu@178.62.2.107" # lxc container

after "deploy:create_symlink", "deploy:npm_install", "deploy:restart"
