
'use strict';
/**
 * Provides logging of actions
 * @description
 * This model stores actions that users perform on models.
 */
var Action = module.exports = {

    /**
     * @property attributes
     * @type {Object}
     */
    attributes: {

        action  : { type: 'string', required: true },
        author  : { model: 'user', required: true },
        site   : { model: 'site', required: true },
        message : { type: 'string' },
        model   : { type: 'string', required: true }

    },

    /**
	 * Log actions
	 * @param   {String}  action  users action
	 * @param   {Integer} author  user performing action
	 * @param   {String}  model   model action was performed on
	 * @param   {String}  message some informative message perhaps
	 * @returns {Array}   newly created Action record
	 */
    log: function(action, author, model, message) {

        AuditLog.create({
            action: action,
            author: author.id,
            site: author.site,
            message: message,
            model: model
        })
            .then(function (model) {
            AuditLog.publishCreate(model);
            return [model];
        })
            .catch(function (err) {
            sails.log.warn(err);
        });
    }

};
