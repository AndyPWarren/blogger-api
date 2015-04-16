# Initial vagrant file with docker provider
#Run with vagrant up --provider=docker
Vagrant.configure("2") do |config|
  config.vm.define "firstmate-api" do |v|
    v.vm.provider "docker" do |d|
      #pull in host vm vagrant file
      d.vagrant_vagrantfile = "./Vagrantfile-proxy"
      #path to docker app
      d.build_dir = "."
      #expose ports in docker container
      d.ports = ["1337:1337","9000:9000"]
      d.name = "firstmate-api"
      d.cmd = ["forever", "-w start", "app.js"]
      d.volumes = [
        "/vagrant/api:/app/api",
        "/vagrant/config:/app/config",
        "/vagrant/tests:/app/tests",
        "/vagrant/coverage:/app/coverage",
        "/vagrant/app.js:/app/app.js"
        ]
    end
  end
end
