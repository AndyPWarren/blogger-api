/**
 * Routes
 *
 * These routes map URLs to views and controllers.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

    'GET /': 'IndexController.about',
    'GET /v1': 'IndexController.about',

    /**
     * User
     *
     * @desc The user resource handles registration and authentication.
     * @docs http://docs.firstmate.apiary.io/reference/user
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

    // Site
    'GET /v1/sites/:domain': 'SiteController.getOne',

    // Posts
    'GET /v1/posts': 'PostController.getAll',
    'GET /v1/posts/:domain': 'PostController.getAll',
    'GET /v1/posts/:domain/:id': 'PostController.getOne',
    'POST /v1/posts': 'PostController.create',

    // Files
    'POST /v1/files': 'FileController.uploadImages',
    'GET /v1/files/:id': 'FileController.file',

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
