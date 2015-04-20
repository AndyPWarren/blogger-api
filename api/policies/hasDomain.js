'use strict';
/**
 * #Policy: users in site name
 * find all users that belong to a website
 */

/**
 * @module useCurrentUser
 * @param {Object} req   express request object
 * @param {Object} res   express response object
 * @param {Object} next  next in middleware chain
 */
module.exports = function(req, res, next) {

    if (req.param("domain")) {
        return next();
    } else {
        return res.forbidden(req.__('Error.Domain.NotSet'));
    }
};
