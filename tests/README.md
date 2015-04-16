# Test Suite

Our test suites use the [Mocha](http://mochajs.org/) framework with the following tools:
- [Chai](http://chaijs.com/) assertion library
- [Sinon.JS](http://sinonjs.org/) for spies, stubs and mocks
- [SuperTest](https://www.npmjs.com/package/supertest) for HTTP assertions

### Chai
Chai has several interfaces, we use the chain-capable BDD style with expect syntax. For more information see the [Chai API documentation](http://chaijs.com/api/bdd/). We're also making use of the [Sinon-Chai plugin](http://chaijs.com/plugins/sinon-chai) to provide custom assertions for Sinon.JS.

#Development Testing

It is recommended that you run tests inside a docker container.

###Testing using Vagrant

Testing with Vagrant requires the main FirstMate container to be stopped (if its running). To do this SSH into the vagrant machine and type:

	$ docker stop {container-name}

Then back in Windows command prompt 

	$ vagrant docker-run -- grunt {test-command}

*note using the CygWin terminal is a much more pleasing experience

###Testing using Fig

NEED TO ADD

###Testing Commands

To run the test suite in development, with auto-reruns on code changes and coverage reports at ./coverage/lcov-report, run:

	$ grunt dev

This will start a connect server and wait for any changes in the source files. It will then run the test:spec task when it detects a change.

The following command will run the tests with the xunit-file reporter its mainly used for CI testing with shippable

	$ grunt test

This will run the tests with the spec reporter, a more pleasing output when using the terminal

	$ grunt test:spec

This command will run tests with the file suffix: .spec.dev.js 
It is useful for running development tests where you might be focusing on a specific piece of code and you don't want to see results from other tests

	$ grunt test:dev

If there are .spec.dev.js files present then both test and test:spec tasks will fail and report the location of the dev test files. In an effort to sanitize the tests directory any spec.dev.js files will not be committed to a branch. Please create a .spec.js file once development has finished.