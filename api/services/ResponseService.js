'use strict';

var packageJson = require('../../package.json');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Provides JSON response utilities
 */
var ResponseService = module.exports = {

    /**
     * Formats JSON response payload for consistency.
     * ### Example:
     * ```javascript
     * ResponseService.formatJson({
     *      "data": { "firstName": "John", "lastName": "Smith" },
     *      "meta": { "message": "some additional meta data" },
     *      "model": "user"
     * });
     *
     * returns {
     *      data: {
     *          'user': {
     *              'firstName': 'John',
     *              'lastName': 'Smith',
     *          }
     *      },
     *      meta: {
     *          'status': 200,
     *          'version': 0.0.2,
     *          'message': 'some additional meta data'
     *      }
     * }
     * ```
     *
     * @param   {Object} dataToFormat object to format eg. `{ data: {...}, meta: {...}, model: '' }`
     * @return  {Object} jsonPayload  formatted JSON response payload
     * @method formatJson
     */
    formatJson: function(dataToFormat){

        var model = dataToFormat.model || 'item',
            data = dataToFormat.data || undefined,
            meta = dataToFormat.meta;

        var jsonPayload = {
            'data': {},
            'meta': {
                'version': packageJson.version
            }
        };

        // pluralise the model label if data is a list
        if (data && data.length !== undefined) {
            model = model + 's';
        }

        // assign data object to jsonPayload with modellabel
        if (data) {
            jsonPayload.data[model] = data;
        }

        // check for errors and assign meta
        if (meta && meta.code) {

            _.assign(jsonPayload.meta, meta);

        } else if (meta && !meta.code) {

            // assume success if no errors
            jsonPayload.meta.code = 200;
            _.assign(jsonPayload.meta, meta);

        } else {
            // assume success if no meta object
            jsonPayload.meta.code = 200;
        }

        return jsonPayload;
    },

    /**
     * Formats data object with `this.formatJson()` and sends JSON response.
     * @param   {Object}   req   express request object
     * @param   {Object}   res   express response object
     * @param   {Object}   data  data object to format and send
     * @param   {String}   type  set response type [json|jsonx] defaults to json
     * @return  {Function} res.json(response)
     * @method send
     */
    send: function(req, res, data, type){

        // add label from model
        if (!data.model) {
            data.model = req.options.model;
        }

        // response log
        this.log(req, res);

        // format response
        var response = this.formatJson(data);

        // if response is a list
        if (data.data && data.data.length !== undefined) {
            // attach sort params to meta
            _.assign(response.meta, PaginationUtils.sortBy(req));

            if (data.meta) {
                // check requested page is not greater than total number of pages
                var totalPages = response.meta.totalPages,
                    currentPage = response.meta.currentPage;

                if (totalPages && currentPage && currentPage > totalPages) {
                    return res.notFound('Page ' + currentPage + ' doesn\'t exist. There are ' + totalPages + ' pages.');
                }
            }
        }

        switch (type) {
            case 'jsonx':
                return res.jsonx(response);
            default:
                return res.json(response);
        }

    },

    /**
     * Logs response stats to sails.log
     * @param {Object} req express request object
     * @param {Object} res express response object
     */
    log: function (req, res){

        var httpStatus = '(HTTP/' + req.httpVersion + ' ' + res.statusCode + ')',
            bytesRead = '0 bytes read',
            bytesWritten = '0 bytes written';

        if (res.connection) {
            bytesRead = res.connection.bytesRead + ' bytes read';
            bytesWritten = res.connection.bytesWritten + ' bytes written';
        }

        sails.log.debug([req._startTime], req.method, req.url, '=>', bytesRead, bytesWritten, httpStatus );

    }
};
