'use strict';

var packageJson = require('../../package.json');

/**
 * Provides methods for `/` endpoint.
 * @module IndexController
 */
var IndexController = {

    /**
     * Return information about the API
     * @param   {Object}  req express request object
     * @param   {Object}  res express response object
     * @return  {Service} ResponseService.send
     */
    about: function (req, res) {
        var welcome = {
            title: packageJson.name,
            description: packageJson.description,
//            docs: 'http://docs.firstmate.apiary.io/',
            homepage: packageJson.url,
            author: packageJson.author,
            license: packageJson.license
        };

        return ResponseService.send(req, res, { meta: welcome, model: 'api' });
    }

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = IndexController;
