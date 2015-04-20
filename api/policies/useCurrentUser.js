'use strict';
/**
 * #Policy: useCurrentUser
 * Enforce current user as owner of models.
 */

/**
 * @module useCurrentUser
 * @param {Object} req   express request object
 * @param {Object} res   express response object
 * @param {Object} next  next in middleware chain
 */
module.exports = function(req, res, next) {

    // Enforce the owner parameter as the current user id
    if(req.user) {
        req.body.author = req.user.id;
        return next();
    } else {
        sails.log.warn('Used "useCurrentUser" policy without enforcing authentication.');
        return next();
    }

};
