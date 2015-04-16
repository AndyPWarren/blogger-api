'use strict';
/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden('Access denied.');
 *
 * @param {String|Object|Array} message
 *      optional message to inject into view locals or JSON response
 *
 */

module.exports = function forbidden(message) {

    // Get access to `req`, `res`, `sails`
    var req = this.req,
        res = this.res,
        sails = req._sails;

    var meta = {
        code: 403,
        errorType: req.__('Response.403')
    };

    // Set status code
    res.status(meta.code);

    // Set optional error message
    if (message) {
        meta.message = message;
    }

    // Format & send JSON response
    return ResponseService.send(req, res, { meta: meta });
};
