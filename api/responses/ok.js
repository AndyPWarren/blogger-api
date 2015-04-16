'use strict';
/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 *
 * @param  {Object} data
 */

module.exports = function sendOK (data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req,
        res = this.res,
        sails = req._sails;

    // Set status code
    res.status(200);

    // Format & send JSON(P) response
    return ResponseService.send(req, res, { data: data }, 'jsonx');

};
