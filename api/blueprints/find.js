'use strict';
/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findRecords (req, res) {

    // Look up the model
    var Model = ActionUtil.parseModel(req);

    /**
     * search criteria
     * @property {object} criteria
     */
    var criteria = ActionUtil.parseCriteria(req);

    /**
     * get page number from request
     * @property {Number} groupId
     */
    var page = ActionUtil.parsePage(req);

    /**
     * get limit number from request
     * @property {Number} limit
     */
    var limit = ActionUtil.parseLimit(req);

    /**
     * get sort parameter
     * @property {string} sort
     */
    var sort = ActionUtil.parseSort(req);



    // If an `id` param was specified, use the findOne blueprint action
    // to grab the particular instance with its primary key === the value
    // of the `id` param.   (mainly here for compatibility for 0.9, where
    // there was no separate `findOne` action)
    if ( ActionUtil.parsePk(req) ) {
        return require('sails/lib/hooks/blueprints/actions/findOne')(req,res);
    }

    // Lookup for records that match the specified criteria
    var query = Model.find()
        .where( criteria )
        .paginate({ page: page, limit: limit })
        .sort( sort );

    // TODO: .populateEach(req.options);
    query = ActionUtil.populateEach(query, req);
    query.exec(function found(err, matchingRecords) {
        if (err) return res.serverError(err);

        // Only `.watch()` for new instances of the model if
        // `autoWatch` is enabled.
        if (req._sails.hooks.pubsub && req.isSocket) {
            Model.subscribe(req, matchingRecords);
            if (req.options.autoWatch) { Model.watch(req); }
            // Also subscribe to instances of all associated models
            _.each(matchingRecords, function (record) {
                ActionUtil.subscribeDeep(req, record);
            });
        }

        var meta = PaginationUtils.count(Model, page, limit, criteria);

        return ResponseService.send(req, res, {
            data: matchingRecords,
            meta: meta
        });
    });
};
