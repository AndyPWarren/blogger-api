'use strict';
/**
 * #Policy: auditLog
 * Logs actions to auditLog
 */

/**
 * @module auditLog
 * @param {Object} req   express request object
 * @param {Object} res   express response object
 * @param {Object} next  next in middleware chain
 */
module.exports = function(req, res, next) {

    if (req.user) {
        AuditLog.log(req.options.action, req.user, req.options.model);
    } else {
        sails.log.warn('Used "auditLog" policy without enforcing authentication.');
    }

    next();

};
