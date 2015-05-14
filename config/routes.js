/**
 * Routes
 *
 * These routes map URLs to views and controllers.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

    'GET /about': 'IndexController.about',
    'GET /v1/about': 'IndexController.about',

    '/': {
        view: 'login'
    },


    /**
     * User
     *
     * @desc The user resource handles registration and authentication.
     * @docs http://docs.blogger-api.apiary.io/reference/user
     */

    // Users
    'GET /v1/users': 'UserController.find',
    // 'POST /v1/users': { blueprint: 'create' },

    // Current User
    'GET /v1/users/current': 'UserController.current',

    // Auth
    'POST /v1/users/auth/local': 'AuthController.callback',
    'POST /v1/users/auth/local/:action': 'AuthController.callback',
    'GET /v1/users/logout': 'AuthController.logout',

    // User
    'GET /v1/users/:id': 'UserController.getOne',
    // 'PUT /v1/users/:id': { blueprint: 'update' },


    /**
     * Site
     * the site resource handles domains that users belon
     */
    //Get all unauthorized sites for overload to approve
    'GET /v1/sites': 'SiteController.getAll',
    //get individual site
    'GET /v1/sites/:domain': 'SiteController.getOne',
    //authorize a site
    'GET /v1/sites/:domain/authorize': 'SiteController.authorize',


    // Posts
    'GET /v1/posts': 'PostController.getAll',
    'GET /v1/posts/:domain': 'PostController.getAll',
    'GET /v1/posts/:domain/:id': 'PostController.getOne',
    'POST /v1/posts': 'PostController.create',
    'DELETE /v1/posts/:id': 'PostController.delete',

    // Files
    'POST /v1/files': 'FileController.uploadImages',
    'GET /v1/files/:id': 'FileController.file',
    'DELETE /v1/files/:id': 'FileController.deleteFile',

    /**
     * Document
     *
     * @desc The document resource enables the storage, retrieval and categorisation of documents.
     * @docs http://docs.firstmate.apiary.io/#reference/document
     */

    /**
     * Actions
     *
     * @desc
     * @docs
     */
    'GET /v1/actions': 'AuditLogController.find',
    'GET /v1/actions/:model': 'AuditLogController.find'


    // If a request to a URL doesn't match any of the custom routes above, it is matched
    // against Sails route blueprints.  See `config/blueprints.js` for configuration options
    // and examples.

};
