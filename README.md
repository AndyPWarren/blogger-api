# Multisite-blogger

This is the project repository for the Multisite-blogger core application. This package provides:

* API services


### Docker

The Multisite-blogger API is designed to be run under docker. This section will describe how to get the application up and running under docker.

#### Building the Docker Image

First step is to get docker installed on your system. You will need to use Boot2Docker on OSX/Windows and you can follow the basic instructions here but shout for help if you are not sure:

https://docs.docker.com/installation/#installation

Once you have docker running the first thing to do is build the docker image.

#### Running the Application

    $ docker run --rm -it spectrakey/blogger-api:develop

#### Running in Development

To run the application in development, we're using [fig](http://www.fig.sh/) for OSX and [Vagrant](https://www.vagrantup.com/) for Windows.

##### Fig (OSX)
Fig defines all the services that make up the app in fig.yml and runs them together in an isolated environment. Simply run:

    $ fig up

To attach your local code for development, un-comment the relevant application volumes in fig.yml.

Check it out at [http://localdocker:1337](http://localdocker:1337)

##### Vagrant (Windows)

Ensure you have the following installed:

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](https://www.vagrantup.com/)

The following instructions will:

- Create a Host VM running Ubuntu
- Install docker
- Build the docker container with the app
- Launch the sails app, with auto server reload when changes are made to the source files


1. Open command prompt as an adminstrator
2. `cd` into the root directory of the blogger-api repo
3. Run `vagrant up --provider=docker`
4. Check it out at [http://localhost:1337](http://localhost:1337)

You can SSH into the vagrant VM (using PuTTY) and interact with docker through the terminal.

Running `vagrant docker-logs -f` (in windows command prompt) prints the docker container output to the terminal i.e. application errors (useful for debugging).


### Without Docker
You can of course run the application without docker, just following the guide below.

#### Prerequisites

There are some prerequisites that need to be installed before you can install the project:

 - SailsJS v0.10 `sudo npm install sails -g`
 - ForeverJS `sudo npm install forever -g`

#### Install the Project

Clone this repository, cd into the project directory and run:

    $ npm install

#### Running the Application

    $ npm start

#### Running in Development

    $ forever -w start app.js

Check it out at [http://localhost:1337](http://localhost:1337)
The server will restart automatically with changes to the source files.

## Testing

Testing uses the mocha framework, with istanbul for coverage reports. Provided you have followed the steps above you can run the test suite by running the following command:

    $ grunt test

#### Running Tests in Development

To run the test suite in development, with auto-reruns on code changes and coverage reports at `./coverage/lcov-report`, run:

    $ grunt dev

If you are using vagrant;
- Stop the API container, SSH into the vagrant machine and run `docker stop {container-name}`
- Go to CMD and run `vagrant docker-run -- grunt dev`

See the [testing README](./tests/README.md) for more information regarding the test suites.



