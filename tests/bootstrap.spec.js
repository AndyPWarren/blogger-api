'use strict';

var Sails = require('sails'),
    Barrels = require('barrels'),
    barrels,
    fixtures,
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    request = require('supertest');

global.expect = chai.expect;
global.sinon = require('sinon');

chai.use(sinonChai);

/**
 * Sails configuration for test runs
 */
var testConfig = {
    environment: 'test',
    hooks: {
        grunt: false
    },
    log: {
        level: 'warn'
    },
    models: {
        connection: 'test',
        migrate: 'drop'
    }
};

before(function(done) {
    Sails.lift(testConfig, function(err, sails) {
        if (err) {
            return done(err);
        }

        // Load fixtures
        barrels = new Barrels(process.cwd() + '/tests/fixtures');
        fixtures = barrels.data;
        // Fixtures are loaded gradually to ensure correct associations
        // User, group fixtures
        barrels.populate(['user', 'site'], function(errUser) {

            if (errUser) sails.log.error('Fixture Error: ' + errUser);

            // Passport fixture
            barrels.populate(['passport'], function(errPassport) {

                if (errPassport) sails.log.error('Fixture Error: ' + errPassport);

                // Load more fixtures here if required
                if (!errUser && !errPassport) sails.log.info('Fixtures loaded proper.');

                done(err, sails);

            }, false);

        }, false);

        global.sails = sails;
        global.agent = request.agent(sails.hooks.http.app);

    });
});

after(function(done) {
    Sails.lower(done);
});
