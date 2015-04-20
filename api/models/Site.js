'use strict';


/**
 * Provides the Group model.
 * @description
 * A user group represents a shared resource which other data can be associated with.
 * A user must have a membership with a group to enable interaction with associated data.
 */
module.exports = {

    schema: true,

    /**
     * @property attributes
     * @type {Object}
     */
    attributes: {
        users: { collection: 'User', via: 'site'},
        domain: { type: 'string', required: true }
    },

    usersInSite: function usersInSite(domain){

        return Site.findOne()
            .where({ domain:domain })
            .then(function(site){
                return User.find()
                    .where({site:site.id})
                    .then(function(users){
                        var usersInDomain = [];
                        var length = users.length;

                        for (var i=0; i < length; i++) {
                            usersInDomain[i] = users[i].id;
                        }
                        return usersInDomain;
                    });
            })
            .catch(function(err){
                sails.log.error(err);
            });
    }

};



