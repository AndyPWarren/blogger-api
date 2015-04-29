'use strict';

var fileCtrl = require('./FileController.js');

var PostController = {

    getAll: function (req, res) {
        var reqDomain = req.param("domain");

        var limit = ActionUtil.parseLimit(req);

        var sort = PaginationUtils.validateSort(req, res);

        var page = ActionUtil.parsePage(req);

        Site.doesSiteExist(reqDomain)
            .then(function(site){
                if (site === true) {
                    Site.usersInSite(reqDomain)
                        .then(function(users){
                        var criteria = {author: users};
                        Post.find()
                            .where(criteria)
                            .sort(sort)
                            .then(function(posts){
                            var meta = PaginationUtils.count(Post, page, limit, criteria);
                            return [posts, meta];
                        })
                            .spread(function(posts, meta){
                            return ResponseService.send(req, res, {
                                data: posts,
                                meta: meta
                            });
                        });
                    });
                } else {
                    return res.notFound(req.__('Error.Sites.Domain.NotFound'));
                }
            });
    },


    /**
     * Get an individual user by id
     * @param   {Object}   req express request data
     * @param   {Object}   res express response data
     * @return  {Function} ResponseService
     * @method getOne
     */

    getOne: function (req, res) {

        var reqDomain = req.param("domain");
        var reqId = req.param("id");

        var limit = ActionUtil.parseLimit(req);

        var sort = PaginationUtils.validateSort(req, res);

        var page = ActionUtil.parsePage(req);

        Site.doesSiteExist(reqDomain)
            .then(function(site){
                if (site === true) {
                    Site.usersInSite(reqDomain)
                        .then(function(users){
                            var criteria = {author: users, id: reqId};
                            Post.findOne()
                                .where(criteria)
                                .then(function(posts){
                                    return [posts];

                                })
                                .spread(function(posts){
                                    if (posts !== undefined){
                                        return ResponseService.send(req, res, {
                                            data: posts
                                        });
                                    } else {
                                        return res.notFound(req.__('Response.404'));
                                    }

                                });
                        });
                } else {
                    return res.notFound(req.__('Error.Sites.Domain.NotFound'));
                }
            });
    },

    create: function (req, res) {

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = ActionUtil.parseValues(req);

        var makePost = function(data, files) {
            Post.create(data).exec(function created (err, newInstance) {

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
        };

        //upload image
        req.file('image').upload({
            maxBytes: 1000000
        },function (err, files) {
            if (err) return res.serverError(err);
            if (files.length === 0) {
                makePost(data);
            } else {
                fileCtrl.createFile(files)
                    .then(function(files){
                        if (files.meta.code === 200) {

                            //Add image id to the data object
                            data.image = files.data.id;
                            makePost(data, files);
                        }
                        else {
                            return res.serverError("files not uploaded correctly");
                        }

                    });
            }
        });

    },

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = PostController;
