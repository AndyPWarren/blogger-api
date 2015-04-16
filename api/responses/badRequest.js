'use strict';
/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)'
 * );
 *
 * @param {Array|Object|String} validationErrors
 *      optional errors
 *      usually an array of validation errors from the ORM
 *
 */

module.exports = function badRequest(validationErrors) {

    // Get access to `req`, `res`, `sails`
    var req = this.req,
        res = this.res,
        sails = req._sails;

    var meta = {
        code: 400,
        errorType: req.__('Response.400')
    };

    // Set status code
    res.status(meta.code);

    // Optional validationErrors object
    if (validationErrors) {
        meta.errors = validationErrors;
    }

    // Format & send JSON response
    return ResponseService.send(req, res, { model: req.options.model, meta: meta });

};
