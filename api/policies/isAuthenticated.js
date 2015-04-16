'use strict';
/**
 * #Policy: isAuthenticated
 * Simple policy to allow any authenticated user.
 * Assumes that AuthController.login sets `req.session.authenticated = true;`
 */

/**
 * @module isAuthenticated
 * @param {Object} req   express request object
 * @param {Object} res   express response object
 * @param {Object} next  next in middleware chain
 */
module.exports = function(req, res, next) {

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    if (req.session.authenticated && req.user) {
        return next();
    }

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    return res.forbidden(req.__('Response.403.Message'));
};
