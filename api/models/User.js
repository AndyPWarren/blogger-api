'use strict';

var bcrypt = require('bcryptjs');

/**
 * Provides the user model.
 */

/**
 * @property exports
 * @type {Object}
 */
module.exports = {

    /**
     * @property schema
     * @type {Boolean}
     */
    schema: true,

    /**
     * @property ownerAttribute
     * @type {String}
     */
    ownerAttribute: "id",

    /**
     * @property attributes
     * @type {Object}
     */
    attributes: {

        activated       : { type: 'boolean', defaultsTo: false },
        avatar          : { type: 'url' },
        firstName       : { type: 'string', required: true },
        email           : { type: 'email', unique: true },
        site            : { model: 'Site' },
        lastLoginDate   : { type: 'datetime' },
        lastLoginIp     : { type: 'string' },
        lastName        : { type: 'string', required: true },
        passports       : { collection: 'Passport', via: 'user' },
        admin           : { type: 'boolean', required: true, defaultsTo: false },

        // Instance methods
        name        : function () {
            return this.firstName + ' ' + this.lastName;
        },

        // Overrides the model object
        toJSON      : function () {
            var user = this.toObject();
            delete user.passports;

            user.fullName = this.name();

            return user;
        }
    }

};


