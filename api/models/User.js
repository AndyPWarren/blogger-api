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
        lastLoginDate   : { type: 'datetime' },
        lastLoginIp     : { type: 'string' },
        lastName        : { type: 'string', required: true },
        passports       : { collection: 'Passport', via: 'user' },

        // Instance methods
        name        : function () {
            return this.firstName + ' ' + this.lastName;
        },

        site        : function () {
            var siteArr = this.email.split("@");
            return siteArr[1];
        },

        // Overrides the model object
        toJSON      : function () {
            var user = this.toObject();
            delete user.passports;

            user.fullName = this.name();
            user.siteName = this.site();
            return user;
        }
    }

};


