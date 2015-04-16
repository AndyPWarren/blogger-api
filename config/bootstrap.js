'use strict';
var Barrels = require('barrels'),
    barrels,
    fixtures;

/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

    sails.services.passport.loadStrategies();

    if(sails.config.environment === 'development'){

        // Load fixtures
        sails.log.info('Loading fixtures...');
        barrels = new Barrels(process.cwd() + '/tests/fixtures');
        fixtures = barrels.data;

        // Fixtures are loaded gradually to ensure correct associations
        // User, group fixtures
        barrels.populate(['user','group'], function(errUser) {

            if (errUser) sails.log.error('Fixture Error: ' + errUser);

            // Passport fixture
            barrels.populate(['passport'], function(errPassport) {

                if (errPassport) sails.log.error('Fixture Error: ' + errPassport);

                // Load more fixtures here if required
                barrels.populate(['message']);
                if (!errUser && !errPassport) sails.log.info('Fixtures loaded successfully.');

                cb();

            }, false);

        }, false);

    } else {

        // It's very important to trigger this callack method when you are finished
        // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
        cb();

    }

};
