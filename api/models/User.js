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
        colour          : { type: 'string'},


        // Instance methods
        name        : function () {
            return this.firstName + ' ' + this.lastName;
        },

        initials    : function () {
            return this.firstName.split('')[0] + this.lastName.split('')[0];
        },

        // Overrides the model object
        toJSON      : function () {
            var user = this.toObject();
            delete user.passports;

            user.fullName = this.name();
            user.initials = this.initials();

            return user;
        }


    },

    beforeCreate: function (values, cb){
        var colours = ["#e67373", "#804040","#bf3030","#5c73b8","#554080","#bf6a30"];

        var rnd = Math.floor((Math.random()*5)+1);
        console.log(rnd);
        values.colour = colours[rnd];
        cb();

    }

};


