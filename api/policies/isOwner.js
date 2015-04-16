'use strict';
/**
 * #Policy: isOwner
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

    /**
     * Parse the model from the request
     * @property Model
     */
    var Model = ActionUtil.parseModel(req);

    /**
     * Parse the primary key from the request
     * @property {Number} unique numeric identifier
     */
    var pk = ActionUtil.parsePk(req) || null;

    /**
     * Parse the current user from the session
     * @property {Object} logged in user
     */
    var user = req.user;

    /**
     * Set attribute to use as owner from the model
     * @property {String} attribute to determine 'ownership'
     */
    var ownerAttribute = Model.ownerAttribute || 'owner';

    /**
     * @function
     * Set query to find results where ownerAttribute equals user
     */
    var filterMany = function filterMany() {

        req.options.where = req.options.where || {};
        req.options.where[ownerAttribute] = user.id;

        return next();
    };

    /**
     * @function
     * Check single record's ownerAttribute is the current user
     */
    var filterOne = function filterOne() {

        Model.findOne(pk)
            .exec(function found(err, record) {
                if (err) return res.serverError(err);

                if (record && record[ownerAttribute] !== user.id) {
                    return res.forbidden(req.__('Error.isOwner'));
                }

                return next();
            });
    };


    if (!Model) {

        // No model defined
        sails.log.warn('Used "isOwner" policy against a non model controller.');
        return next();

    } else if (Model.attributes[ownerAttribute]) {

        // Configure the filtering
        if (pk) {

            // Filter individual record
            filterOne();

        } else {

            // Filter list of records
            filterMany();
        }

    } else {

        sails.log.warn('Used "isOwner" policy against a model with no "owner" attribute.');
        return next();

    }
};
