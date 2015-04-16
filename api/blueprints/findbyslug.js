'use strict';
/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Find One Record by Slug
 *
 * get /:modelIdentity/:slug
 *
 * An API call to find and return a single model instance from the data adapter
 * using the specified slug.
 *
 * Required:
 * @param {Integer|String} slug  - the unique slug of the particular instance you'd like to look up *
 *
 * Optional:
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findOneRecord (req, res) {

    var Model = actionUtil.parseModel(req);
    var slug = req.options.slug || req.param('slug');

    var query = Model.findOne().where({ slug: slug });
    query = actionUtil.populateEach(query, req);
    query.exec(function found(err, matchingRecord) {
        if (err) return res.serverError(err);
        if(!matchingRecord) return res.notFound('No record found with the specified `slug`.');

        if (sails.hooks.pubsub && req.isSocket) {
            Model.subscribe(req, matchingRecord);
            actionUtil.subscribeDeep(req, matchingRecord);
        }

        res.ok(matchingRecord);
    });

};
