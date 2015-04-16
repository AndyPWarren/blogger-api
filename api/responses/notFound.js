'use strict';
/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 *
 * NOTE:
 * If no user-defined route, blueprint route, or static file matches
 * the requested URL, Sails will call `res.notFound()`.
 */

module.exports = function notFound(message) {

    // Get access to `req`, `res`, `sails`
    var req = this.req,
        res = this.res,
        sails = req._sails;

    var meta = {
        code: 404,
        errorType: req.__('Response.404')
    };

    // Set status code
    res.status(meta.code);

    // Set optional error message
    if (message) {
        meta.message = message;
    }

    // Format & send JSON response
    return ResponseService.send(req, res, { model: req.options.model, meta: meta });

};
