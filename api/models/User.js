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
        group           : { model: 'Group' },
        lastLoginDate   : { type: 'datetime' },
        lastLoginIp     : { type: 'string' },
        lastName        : { type: 'string', required: true },
        passports       : { collection: 'Passport', via: 'user' },
        roles           : { type: 'json' },

        // A collection of issues assigned to a user
        issues      : { collection: 'Issue', via: 'assignee' },

        // A collection of user's messages
        //messages    : { collection: 'message', via: 'user' },

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
    },

    /**
     * Checks whether user is in a group
     * @param   {Number}   userId
     * @param   {Number}   groupId
     * @returns {Boolean} is user in group
     * @method isInGroup
     */
    isInGroup: function isInGroup(userId, groupId){
        return User.findOne()
        .where({ id: userId, group: groupId })
        .then(function(user){
            if (user === undefined) {
                return false;
            } else {
                return true;
            }
        })
        .catch(function(err){
            sails.log.error(err);
        });
    }

};


