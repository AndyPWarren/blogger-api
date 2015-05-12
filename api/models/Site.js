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
        users:      { collection: 'User', via: 'site'},
        domain:     { type: 'string', required: true },
        authorized: { type: 'boolean' }
    },

    beforeCreate: function(site, next){

        site.authorized = false;

        console.log(site);
        next();
    },

    doesSiteExist: function doesSiteExist(domain){
        return Site.findOne()
            .where({domain:domain})
            .then(function(site){
                if (site) {
                    return true;
                } else {
                    return false;
                }
            });
    },

    usersInSite: function usersInSite(domain){

        return Site.findOne()
            .where({ domain:domain })
            .then(function(site){
                if (site) {
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
                }
            })
            .catch(function(err){
                sails.log.error(err);
            });
    },

    siteidSameAsEmail: function siteidSameAsEmail(email, siteId){

        var emailDomainArr = email.split("@"),
            emailDomain = emailDomainArr[1];

        return Site.findOne()
            .where({domain: emailDomain, id: siteId})
            .then(function(site){
                return site;
            });

    }

};



