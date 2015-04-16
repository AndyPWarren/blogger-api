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

    /**
     * Group
     *
     * @desc The Group resource represents a shared asset which other data can be associated with.
     * @docs http://docs.firstmate.apiary.io/reference/group
     */

    // Groups
    // 'GET /v1/groups': { blueprint: 'find' },
    // 'POST /v1/groups': { blueprint: 'create' },

    // Group
    'GET /v1/groups/:slug': { blueprint: 'findbyslug', model: 'group' },
    // 'PUT /v1/groups/:id': { blueprint: 'update' },

    /**
     * Message
     *
     * @desc The message resource provides chat features between users in a group
     * @docs http://docs.firstmate.apiary.io/reference/message
     */

    // Messgaes
    'GET /v1/messages/feed/:id': 'MessageController.feed',
    'POST /v1/messages': 'MessageController.create',

    /**
     * Topic
     *
     * @desc The topic resource facilitates messages with everyone in the group.
     * @docs http://docs.firstmate.apiary.io/reference/topics
     */

    // Topics
    'POST /v1/topics': 'TopicController.create',
    'GET /v1/topics': 'TopicController.groupTopics', //GET all topics associated with user's group
    'GET /v1/topics/:id/messages': 'TopicController.topicMessages', //GET all messages in a specific topic where id = topic ID

    /**
     * Issue
     *
     * @desc The issue resource facilitates the logging and actioning of faults.
     * @docs http://docs.firstmate.apiary.io/reference/issue
     */

    // Issues
    'GET /v1/issues': 'IssueController.getAll',
    'POST /v1/issues': 'IssueController.create',

    // Issue
    'GET /v1/issues/:id': 'IssueController.getOne',
    'PUT /v1/issues/:id': 'IssueController.update',
    'DELETE /v1/issues/:id': 'IssueController.destroy',

    // Assign
    'PUT /v1/issue/:id/assign': 'IssueController.assign',
    'PUT /v1/issue/:id/unassign': 'IssueController.unAssign',

    // Comments
//    'POST /v1/issues/:id/comments': 'IssueController.comment',

    // Comment
//    'PUT /v1/issues/:id/comments/:id': 'IssueController.comment',
//    'DELETE /v1/issues/:id/comments/:id': 'IssueController.comment',

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
