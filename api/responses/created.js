'use strict';
/**
 * 201 (CREATED) Response
 *
 * Usage:
 * return res.created();
 * return res.created(data);
 *
 * @param  {Object} data
 */

module.exports = function sendCreated(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req,
        res = this.res,
        sails = req._sails;

    var meta = {
        code: 201
    };

    // Set status code
    res.status(meta.code);

    // Serve data as JSON(P)
    return ResponseService.send(req, res, { data: data, meta: meta }, 'jsonx');

};
