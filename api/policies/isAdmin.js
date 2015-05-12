'use strict';
/**
 * #Policy: isAdmin
 * @description
 * Filters results by owner as the current user or returns `res.forbidden` on single records
 * that are not owned by the current user. May be used on any find/create/update/destroy actions.
 * If a model has an attribute other than `owner` to represent the 'owner' (eg. 'author'), set
 * `ownerAttribute` in the model.
 *
 * @module isOwner
 * @param {Object} req   express request object
 * @param {Object} res   express response object
 * @param {Object} next  next in middleware chain
 */
module.exports = function(req, res, next) {

    var user = req.user;

    if (user.admin === true) {
        return next();
    } else {
        return res.forbidden(req.__('Response.403.Message'));
    }


};
