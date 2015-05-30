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
            .populate('users')
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

    getAuthorized: function (req, res) {

        Site.find()
            .where({authorized: true})
            .then(function(sites){
                return [sites];
            })
            .spread(function(sites){
                return ResponseService.send(req, res, {
                    data: sites
                });
            });
    },

    getUnauthorized: function (req, res) {

        Site.find()
            .where({authorized: false})
            .then(function(sites){
                return [sites];
            })
            .spread(function(sites){
                return ResponseService.send(req, res, {
                    data: sites
                });
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
            });

    },

    unauthorize: function (req, res) {

        var reqDomain = req.param('domain');

        var values = {
            authorized: false
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
        });

    },

    create: function (req, res){
        var reqDomain = req.param("domain");

        Site.doesSiteExist(reqDomain)
            .then(function(siteExists){
                if (siteExists === false){
                    var site = {
                        domain: reqDomain
                    };
                    Site.create(site).exec(function created (err, newInstance) {

                        // Differentiate between waterline-originated validation errors
                        // and serious underlying issues. Respond with badRequest if a
                        // validation error is encountered, w/ validation info.
                        if (err) return res.negotiate(err);


                        // If we have the pubsub hook, use the model class's publish method
                        // to notify all subscribers about the created item
                        if (req._sails.hooks.pubsub) {
                            if (req.isSocket) {
                                Post.subscribe(req, newInstance);
                                Post.introduce(newInstance);
                            }
                            Post.publishCreate(newInstance, !req.options.mirror && req);
                        }

                        // (HTTP 201: Created)
                        res.status(201);
                        //                console.log(newInstance);
                        //                postData = {
                        //                    data: newInstance.toJson,
                        //                    image: files.data
                        //                }
                        //                console.log(files);
                        res.created(newInstance.toJSON());

                    });
                } else {
                    // site already exists
                    return res.badRequest(req.__('Error.Sites.Exists'));
                }
            });

    }

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = SiteController;
