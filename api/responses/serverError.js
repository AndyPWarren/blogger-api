'use strict';
/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

module.exports = function serverError (data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req,
        res = this.res,
        sails = req._sails;

    // Create the meta object
    var meta = {
        code: 500,
        errorType: req.__('Response.500'),
        message: data
    };

    // Set status code
    res.status(meta.code);

    // Log error to console
    if (data !== undefined) {
        sails.log.error('Sending 500 ("Server Error") response: \n', data);
    } else {
        sails.log.error('Sending empty 500 ("Server Error") response');
    }

    // Only include errors in response if application environment
    // is not set to 'production'.  In production, we shouldn't
    // send back any identifying information about errors.
    if (sails.config.environment === 'production') {
        meta.message = undefined;
    }

    // Format & send JSON(P) response
    return ResponseService.send(req, res, { meta: meta }, 'jsonx');

};
