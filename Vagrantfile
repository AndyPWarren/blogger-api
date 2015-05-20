# Initial vagrant file with docker provider
#Run with vagrant up --provider=docker
Vagrant.configure("2") do |config|
    config.vm.define "blogger-api" do |v|
        v.vm.provider "docker" do |d|
            #pull in host vm vagrant file
            d.vagrant_vagrantfile = "./Vagrantfile-proxy"
            #path to docker app
            d.build_dir = "."
            #expose ports in docker container
            d.ports = ["1337:1337","9000:9000"]
            d.name = "blogger-api"
            d.cmd = ["forever", "-w start", "app.js"]
            d.volumes = [
              "/vagrant/api:/app/api",
              "/vagrant/assets:/app/assets",
              "/vagrant/config:/app/config",
              "/vagrant/coverage:/app/coverage",
              "/vagrant/tasks:/app/tasks",
              "/vagrant/tests:/app/tests",
              "/vagrant/views:/app/views",
              "/vagrant/app.js:/app/app.js",
              ]
        end
    end
end
