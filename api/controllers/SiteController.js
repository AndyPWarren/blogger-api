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
                    if (site.authorized === false) {
                        return res.forbidden(req.__('Error.Sites.NotAuthorized'));
                    } else {
                        return ResponseService.send(req, res, {
                            data: site
                        });
                    }
                } else {
                    return res.notFound(req.__('Response.404'));
                }
            });
    },

    getAll: function (req, res) {

        Site.find()
            .where({authorized: false})
            .then(function(sites){
                return [sites];
            })
            .spread(function(sites){
                if (sites === undefined){
                    var message = "All sites have been authorized";
                    return ResponseService.send(req, res, {
                        data: message
                    });
                } else {
                    return ResponseService.send(req, res, {
                        data: sites
                    });
                }
        });
    },

    authorize: function (req, res) {

        var reqDomain = req.param('domain');

        var values = {
            authorized: true
        };

        Site.findOne()
            .where({domain: reqDomain})
            .then(function(site){

                if (site === undefined) {
                    return res.notFound(req.__('Response.404'));
                } else {

                    Site.update(site.id, values).exec(function(err, site){
                        if (err) return res.server(req.__('Response.500'));

                        return ResponseService.send(req, res, {
                            data: site
                        });
                    });
                }
            })

    },

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = SiteController;
