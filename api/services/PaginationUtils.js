'use strict';
/**
 * PaginationUtils Service
 * Provides pagination utilities
 */

module.exports = {

    /**
     * Provides pagination counts
     * @param   {Object} req         express request object
     * @param   {Object} res         express response object
     * @param   {Object} criteria    waterline select query
     * @returns {Object} countMeta   pagination meta data
     */
    count: function(Model, page, limit, criteria){

        /**
         * Pagination count metadata
         * @property {Object} countMeta
         */
        var countMeta = {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0,
            totalPages: 0
        };

        return Model.count(criteria)
            .then(function (count) {
                countMeta.totalItems = count;
                countMeta.totalPages = Math.ceil(countMeta.totalItems / countMeta.itemsPerPage);

                return countMeta;

            });
    },

    /**
     * Provides list of column sort fields
     * @param   {Object} req express request object
     * @returns {Object} list of column sort fields from model
     */
    sortBy: function(req) {

        /**
         * Model of request
         * @property {Object} Model
         */
        var Model = ActionUtil.parseModel(req);

        /**
         * Sorting meta
         * @property {Object} sortMeta
         */
        var sortMeta = {};

        // check for custom sortBy list on Model
        if (Model.sortBy) {

            // set meta from sortBy on Model
            sortMeta.sortBy = Model.sortBy;

        } else {

            sortMeta.sortBy = [];

            // determine which model attributes are 'sortable' by their type
            _.forOwn(Model._attributes, function(attribute, key) {
                if (attribute.hasOwnProperty('type') && (
                    attribute.type === 'string' ||
                    attribute.type === 'number' ||
                    attribute.type === 'datetime'
                )) {
                    sortMeta.sortBy.push(key);
                }
            });

            // should not sort by id
            _.remove(sortMeta.sortBy, function(attribute) {
                return attribute === 'id';
            });
        }

        // parse current sort and order from request
        sortMeta.sorted = req.param('sort');
        sortMeta.order = req.param('order');

        return sortMeta;
    },

    /**
     * Checks validity of sort and order parameters, using sortBy params from model
     * @param   {Object} req express request object
     * @param   {Object} res express response object
     * @returns {String} waterline sort string
     */
    validateSort: function(req, res) {

        /**
         * Parse sort from request
         * @property {String} sort
         */
        var sort = ActionUtil.parseSort(req);

        /**
         * Parse order from request
         * @property {String} order
         */
        var order = req.param('order');

        /**
         * Retrieve sort metadata from sortBy method
         * @property {Object} sortMeta
         */
        var sortMeta = this.sortBy(req);

        /**
         * Check if the current sort param is defined in the models list of sortable attributes
         * @property {Boolean} validSort
         */
        var validSort = _.contains(sortMeta.sortBy, sort);

        /**
         * Check if the current order param is either ascending or descending
         * @property {Boolean} validOrder
         */
        var validOrder = _.contains(['asc', 'desc'], order);



        if (order && !validOrder) {

            // order is invalid
            res.badRequest({ order: req.__('Error.Pagination.Invalid.Order') });
            return;

        } else if (sort && !validSort) {

            // sort is invalid
            res.badRequest({ sort: req.__('Error.Pagination.Invalid.Sort') });
            return;

        } else if (sort && validSort && order && validOrder) {

            // sort and order are valid so return formatted string for waterline
            return sort + ' ' + order;

        } else if (sort && validSort && !order) {

            // sort is valid and no order is set
            return sort;

        } else {

            // continue with no sort or order
            return;

        }

    }

};
