'use strict';

var ImageCtrl = require('./ImageController.js');
var create = require('../blueprints/create.js');

var S3_KEY = process.env.S3_KEY,
    S3_SECRET = process.env.S3_SECRET,
    S3_BUCKET = process.env.S3_BUCKET;

var makePost = function (data, files, req) {
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
        res.created(newInstance.toJSON());

    });
};

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
                            .populate('author')
                            .populate('images')
                            .sort(sort)
                            .paginate({limit: limit, page: page})
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
                                .populate('images')
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

    delete: function (req, res) {

        var destroyPost = function(req) {

            var pk = ActionUtil.requirePk(req);

            var query = Post.findOne(pk);
            query = ActionUtil.populateEach(query, req);
            query.exec(function foundRecord (err, record) {
                if (err) return res.serverError(err);
                if(!record) return res.notFound('No record found with the specified `id`.');

                Post.destroy(pk).exec(function destroyedRecord (err) {
                    if (err) return res.negotiate(err);

                    if (sails.hooks.pubsub) {
                        Post.publishDestroy(pk, !sails.config.blueprints.mirror && req, {previous: record});
                        if (req.isSocket) {
                            Post.unsubscribe(req, record);
                            Post.retire(record);
                        }
                    }

                    return res.ok(record);
                });
            });
        };

        var reqPostId = req.param("id");

        var userId = req.user.id;

        Post.findOne()
            .where({id: reqPostId, author: userId})
            .then(function(post){
                if (post) {
                    console.log(post);
                    File.find()
                        .where({id: post.images})
                        .then(function(images){
                            console.log(images);
                        });
                    //destroyPost(req);
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
module.exports = PostController;
