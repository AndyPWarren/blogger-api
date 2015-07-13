'use strict';

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Provides methods for `/users` endpoint.
 *
 * API docs: http://docs.firstmate.apiary.io/reference/user
 * @module UserController
 */
var UserController = {

    /**
     * Search for users by name
     * @param   {Object}   req express request data
     * @param   {Object}   res express response data
     * @returns {Function} ResponseService
     * @method find
     */
    find: function (req, res) {

        var name = req.param('name') || '',
            email = req.param('email') || '',
            page = ActionUtil.parsePage(req),
            limit = ActionUtil.parseLimit(req),
            sort = PaginationUtils.validateSort(req, res),
            meta = {},
            criteria = {};

        if (name || email) {
            // Split by space delimiter, for fuzzy searching of both firstName and lastName simultaneously
            name = name.split(' ');

            criteria = {
                or: [
                    { 'firstName': { 'contains': name[0] }},
                    { 'lastName': { 'contains': name[0] || name[1] }}
                ],
                email: { 'contains': email }
            };

            User.find()
                .where(criteria)
                .sort(sort)
                .paginate({ page: page, limit: limit })
                .then(function (models) {

                    // Add pagination counts to meta object
                    var meta = PaginationUtils.count(User, page, limit, criteria);
                    return [models, meta];

                })
                .spread(function (models, meta) {

                    return ResponseService.send(req, res, {
                        data: models,
                        meta: meta
                    });

                })
                .catch(function(err){
                    res.serverError(err);
                });

        } else {
            res.status(400);
            return ResponseService.send(req, res, {
                data: [],
                meta: {
                    code: 400,
                    message: req.__('Error.User.Find.BadRequest')
                }
            });
        }
    },

    /**
     * Get an individual user by id
     * @param   {Object}   req express request data
     * @param   {Object}   res express response data
     * @return  {Function} ResponseService
     * @method getOne
     */
    getOne: function (req, res) {

        var email = req.param('email');

        User.findOne()
            .where({email: email})
            .populate('site')
            .then(function(user){
                return [user];
            })
            .spread(function (model) {
                if (!model) res.status(404);
                return ResponseService.send(req, res, { data: model });
            })
            .catch(function (err) {
                sails.log.error('UserController.getOne: ' + err);
                return ResponseService.send(req, res, { meta: err });
            });
    },

    /**
     * Retrieve current user
     * @param   {Object}   req express request data
     * @param   {Object}   res express response data
     * @return  {Function} ResponseService
     * @method current
     */
    current: function (req, res) {

        if (req.user) {
            return ResponseService.send(req, res, { data: req.user });
        } else {
            return res.forbidden();
        }

    }
};

/**
 * @property exports
 * @type {Object}
 */
module.exports = UserController;
