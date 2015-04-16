'use strict';
/**
 * Extend sails action utilities
 * @requires sails/lib/hooks/blueprints/actionUtil
 */
var extendActionUtil = {

    /**
     * Parse page param
     * @param   {Object}   req express request object
     * @returns {Integer}  page
     */
    parsePage: function (req) {
        var DEFAULT_PAGE = 1;
        var page = req.param('page') || (typeof req.options.page !== 'undefined' ? req.options.page : DEFAULT_PAGE);
        return page;
    }

};

/**
 * Extend and override sails actionUtil with above methods
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
module.exports = actionUtil;
_.extend(module.exports, extendActionUtil);
