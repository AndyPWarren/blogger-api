'use strict';

/**
 * @description Server-side logic for reading actions
 * @todo This is prototype code, requires refactoring
 * @module AuditLogController
 */
var AuditLogController = module.exports = {

    /**
     * Retrieve actions by search criteria
     * @param   {Object}  req express request object
     * @param   {Object}  res experss response object
     * @returns {Function} ResponseService
     */
    find: function (req, res) {

        var criteria = ActionUtil.parseCriteria(req),
            page = ActionUtil.parsePage(req),
            limit = ActionUtil.parseLimit(req);

        AuditLog.find(criteria)
            .sort('createdAt DESC')
            .paginate({ page: page, limit: limit })
            .populate('author')
            .then(function (models) {
                return [models];
            })
            .spread(function(models){

                // Only `.watch()` for new instances of the model if
                // `autoWatch` is enabled.
                if (req._sails.hooks.pubsub && req.isSocket) {
                    AuditLog.subscribe(req, models);
                    if (req.options.autoWatch) { AuditLog.watch(req); }
                    // Also subscribe to instances of all associated models
                    _.each(models, function (record) {
                        ActionUtil.subscribeDeep(req, record);
                    });
                }

                return ResponseService.send(req, res, { data: models });
            })
            .catch(function(err){
                sails.log.warn(err);
                return res.notFound(err);
            });
    }

};
