'use strict';

/**
 * A site represents a customer website which other data can be associated with. \
 * A user must have a membership with a site to enable interaction with blogs.
 *
 * API docs: http://docs.blogger.apiary.io/#reference/site
 * @module SiteController
 */
var SiteController = {


    getOne: function (req, res) {

        var reqDomain = req.param("domain");

        Site.findOne()
            .where({domain: reqDomain})
            .then(function(site){
                return [site];
            })
            .spread(function(site){

                if (site !== undefined){
                    return ResponseService.send(req, res, {
                        data: site
                    });
                } else {
                    return res.notFound(req.__('Response.404'));
                }
            });
    }
};

/**
 * @property exports
 * @type {Object}
 */
module.exports = SiteController;
