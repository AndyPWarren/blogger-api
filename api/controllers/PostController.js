'use strict';


var PostController = {

    getAll: function (req, res) {
        var reqDomain = req.param("domain");

        var limit = ActionUtil.parseLimit(req);

        var sort = PaginationUtils.validateSort(req, res);

        var page = ActionUtil.parsePage(req);

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
                    })
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

                    })
            });
    }

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = PostController;
